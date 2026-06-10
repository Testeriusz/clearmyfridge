# ClearMyFridge — Data Model

All tables live in the Supabase `public` schema and use Row Level Security (RLS)
so every query is automatically scoped to the authenticated user.
Primary keys are UUID v4 (`gen_random_uuid()`).
Timestamps are `timestamptz` stored in UTC.

---

## Table of Contents

1. [profiles](#1-profiles)
2. [fridge_items](#2-fridge_items)
3. [shopping_items](#3-shopping_items)
4. [recipes](#4-recipes)
5. [recipe_ingredients](#5-recipe_ingredients)
6. [Relationships diagram](#6-relationships-diagram)
7. [RLS policy summary](#7-rls-policy-summary)

---

## 1. `profiles`

Extends Supabase Auth. One row per registered user.
Created automatically via a database trigger on `auth.users`.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `uuid` | NO | Primary key. Mirrors `auth.users.id` — keeps application tables out of the auth schema while maintaining a 1-to-1 link. |
| `email` | `text` | NO | Cached from auth for display and future email notifications. Kept in sync via the same trigger that creates the row. |
| `dietary_preferences` | `text[]` | YES | Array of tags chosen by the user (e.g. `{vegetarian, gluten-free}`). Drives recipe filtering (US-11, US-12) without a separate join table. |
| `push_token` | `text` | YES | Device push-notification token. Stored here so the backend edge function that scans for expiring items (US-03) knows where to send the alert. NULL until the user grants notification permission. |
| `created_at` | `timestamptz` | NO | Row creation time. Default: `now()`. |
| `updated_at` | `timestamptz` | NO | Updated by a `before update` trigger. Lets the client know whether to re-fetch preferences. |

---

## 2. `fridge_items`

The core inventory table. One row per distinct product the user has at home.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `uuid` | NO | Primary key. |
| `user_id` | `uuid` | NO | Foreign key → `profiles.id`. Links each item to its owner — the RLS policy `fridge_items_owner` filters every SELECT/INSERT/UPDATE/DELETE to rows where `user_id = auth.uid()`, so users never see each other's data. |
| `name` | `text` | NO | Human-readable product name. Supplied by the user, auto-filled from a barcode lookup, or seeded when a checked-off shopping item is moved here (US-08). |
| `quantity` | `numeric` | NO | How much of the product remains (e.g. `2`, `0.5`). Numeric (not integer) to support fractional amounts like half a pack. |
| `unit` | `text` | YES | Unit of measurement (`g`, `ml`, `pcs`, `L`, etc.). Paired with `quantity` for display; NULL is acceptable for items counted as whole pieces. |
| `expiry_date` | `date` | YES | The best-before or use-by date. Drives the colour-coded status (green / amber / red) on the Fridge screen (US-04) and the 3-day alert scheduler (US-03). NULL for items without a fixed expiry (e.g. salt). |
| `barcode` | `text` | YES | EAN-13 / UPC barcode scanned at add time (US-09, US-10). Stored so future scans of the same product can skip the lookup API and auto-fill from the user's own history. |
| `category` | `text` | YES | Coarse food category (`dairy`, `meat`, `produce`, `bakery`, `condiments`, …). Used for visual grouping and, later, smarter recipe matching. |
| `added_from_shopping` | `boolean` | NO | `TRUE` when this row was created automatically by checking off a shopping list item (US-08). Lets the app skip the manual-entry form and signals analytics that the end-to-end shopping→fridge flow was used. Default: `FALSE`. |
| `created_at` | `timestamptz` | NO | Default: `now()`. |
| `updated_at` | `timestamptz` | NO | Updated by trigger on every edit (US-02). |

---

## 3. `shopping_items`

The user's shopping list. Items here are either added manually or generated from a recipe's missing ingredients.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `uuid` | NO | Primary key. |
| `user_id` | `uuid` | NO | Foreign key → `profiles.id`. RLS policy restricts all access to the item's owner. |
| `name` | `text` | NO | Product to buy. Pre-filled from the recipe ingredient name when `source_recipe_id` is set. |
| `quantity` | `numeric` | YES | Desired purchase amount. NULL when the user just wants a reminder to buy something without specifying how much. |
| `unit` | `text` | YES | Paired with `quantity`. Carried over from `recipe_ingredients.unit` when added from a recipe. |
| `is_checked` | `boolean` | NO | `TRUE` once the user taps the item in-store. When `is_checked` is set, the app creates a corresponding `fridge_items` row and deletes this one, completing the shopping→fridge loop (US-08). Default: `FALSE`. |
| `source_recipe_id` | `uuid` | YES | Foreign key → `recipes.id`. Set when this item was added via "add missing ingredients to shopping list" (US-07). NULL for manually added items. Allows the app to show "you're now ready to cook X" once all items from a recipe are checked off. |
| `created_at` | `timestamptz` | NO | Default: `now()`. |

---

## 4. `recipes`

Stores AI-generated recipe suggestions. Caching them avoids redundant API calls when the fridge contents haven't changed, and lets users save favourites.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `uuid` | NO | Primary key. |
| `user_id` | `uuid` | NO | Foreign key → `profiles.id`. Recipes are personalised — generated from this specific user's fridge contents and dietary preferences. |
| `name` | `text` | NO | Recipe title returned by the AI (US-05). |
| `instructions` | `text` | NO | Step-by-step cooking instructions. Stored as plain text; the client renders it. |
| `calories` | `integer` | YES | Total calories per serving (US-06). NULL if the AI could not estimate confidently. |
| `protein_g` | `numeric` | YES | Protein in grams per serving (US-06). |
| `carbs_g` | `numeric` | YES | Carbohydrates in grams per serving (US-06). |
| `fat_g` | `numeric` | YES | Fat in grams per serving (US-06). |
| `dietary_tags` | `text[]` | YES | Tags applied by the AI (`vegetarian`, `gluten-free`, etc.). Enables client-side filtering without re-querying the AI (US-12). |
| `is_saved` | `boolean` | NO | `TRUE` when the user explicitly saves the recipe. Unsaved recipes can be pruned by a scheduled job to keep storage lean. Default: `FALSE`. |
| `fridge_snapshot` | `jsonb` | NO | Serialised list of `fridge_items` ids and expiry dates at the moment of generation. Used to detect when the fridge has changed enough to warrant fresh suggestions, avoiding identical results being regenerated on every page visit. |
| `generated_at` | `timestamptz` | NO | Default: `now()`. Used alongside `fridge_snapshot` to decide staleness. |

---

## 5. `recipe_ingredients`

Normalises the ingredients list out of `recipes`. One row per ingredient per recipe.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `uuid` | NO | Primary key. |
| `recipe_id` | `uuid` | NO | Foreign key → `recipes.id` (cascade delete). Scoping to the recipe allows efficient queries like "give me all missing ingredients for recipe X". |
| `name` | `text` | NO | Ingredient name as returned by the AI. |
| `quantity` | `numeric` | YES | Amount required. NULL when the AI specifies an ingredient without a quantity (e.g. "salt to taste"). |
| `unit` | `text` | YES | Unit for the quantity above (`g`, `ml`, `tbsp`, …). |
| `is_in_fridge` | `boolean` | NO | Pre-computed flag set at generation time: `TRUE` if a matching `fridge_items` row existed with sufficient quantity. Drives the "missing ingredients" badge on the recipe card (US-05) and the one-tap "add to shopping list" action (US-07). Recomputed on demand if `fridge_snapshot` is stale. |

---

## 6. Relationships diagram

```
auth.users
    │
    └─(1:1)─▶ profiles
                  │
                  ├─(1:N)─▶ fridge_items
                  │
                  ├─(1:N)─▶ shopping_items
                  │              │
                  │              └─(N:1)──────────────────┐
                  │                                       │
                  └─(1:N)─▶ recipes ◀──(source_recipe_id)┘
                                │
                                └─(1:N)─▶ recipe_ingredients
```

---

## 7. RLS policy summary

Every table has RLS enabled. The pattern is uniform:

```sql
-- Example for fridge_items (repeated for all tables)
create policy "owner access"
  on fridge_items
  for all
  using (user_id = auth.uid());
```

`profiles` uses `id = auth.uid()` instead of `user_id`.
`recipe_ingredients` inherits protection indirectly via the join to `recipes`, but also carries its own policy via `recipe_id in (select id from recipes where user_id = auth.uid())` to prevent direct-access leaks.
