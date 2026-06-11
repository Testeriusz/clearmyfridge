import { useState, useEffect, useRef } from 'react';

import { supabase } from './supabaseClient';
import { TabBar, Toast } from './ui';
import Login            from './screens/Login';
import HomeScreen                            from './screens/Home';
import FridgeScreen, { ItemForm, ItemDetail } from './screens/Fridge';
import RecipesScreen, { RecipeDetail }        from './screens/Recipes';
import ShoppingScreen   from './screens/Shopping';
import AlertsScreen     from './screens/Alerts';
import SettingsScreen   from './screens/Settings';
import OnboardingScreen from './screens/Onboarding';

const LS = {
  get(k, d) {
    try { const v = localStorage.getItem('cmf_' + k); return v == null ? d : JSON.parse(v); }
    catch { return d; }
  },
  set(k, v) { try { localStorage.setItem('cmf_' + k, JSON.stringify(v)); } catch {} },
};

function guessCat(name) {
  const n = name.toLowerCase();
  const map = {
    Dairy:   ['milk', 'yogurt', 'cheese', 'butter', 'cream'],
    'Fruit & Veg': ['tomato', 'onion', 'garlic', 'pepper', 'spinach', 'lemon', 'apple', 'carrot', 'herb', 'lime', 'dill', 'berry', 'banana', 'orange', 'grape', 'mango', 'cucumber', 'broccoli', 'mushroom', 'courgette', 'aubergine'],
    Protein: ['chicken', 'salmon', 'egg', 'beef', 'pork', 'tofu', 'fish', 'thigh'],
    Pantry:  ['oil', 'rice', 'paprika', 'salt', 'pasta', 'flour', 'spice', 'honey', 'oats', 'coffee'],
    Bakery:  ['bread', 'roll', 'bun', 'bagel'],
  };
  for (const [cat, words] of Object.entries(map)) {
    if (words.some(w => n.includes(w))) return cat;
  }
  return 'Other';
}

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (!session) return <Login />;
  return <AuthedApp user={session.user} />;
}

function AuthedApp({ user }) {
  const [onboarded, setOnboarded]       = useState(() => LS.get('onboarded', false));
  const [tab, setTab]                   = useState(() => LS.get('tab', 'home'));
  const [fridge, setFridge]             = useState([]);
  const [shopping, setShopping]         = useState([]);
  const [saved, setSaved]               = useState([]);
  const [generated, setGenerated]       = useState([]);
  const [generating, setGenerating]     = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [filters, setFilters]           = useState(() => LS.get('filters', []));
  const [notifOn, setNotifOn]           = useState(true);
  const pendingDeleteRef                = useRef(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [itemForm, setItemForm]         = useState({ open: false, editing: null });
  const [detailItem, setDetailItem]     = useState(null);
  const [recipe, setRecipe]             = useState(null);
  const [toast, setToast]               = useState(null);
  const toastTimer                      = useRef(null);

  useEffect(() => LS.set('tab', tab), [tab]);
  useEffect(() => LS.set('filters', filters), [filters]);

  // ── DB loaders ────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase
      .from('fridge_items')
      .select('id, name, qty, category, expiry_date')
      .eq('user_id', user.id)
      .order('expiry_date', { ascending: true, nullsLast: true })
      .then(({ data, error }) => { if (!error && data) setFridge(data.map(rowToItem)); });
  }, []);

  useEffect(() => {
    supabase
      .from('shopping_items')
      .select('id, name, category, done')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setShopping(data.map(r => ({ ...r, cat: normCat(r.category), source: 'manual' })));
      });
  }, []);

  useEffect(() => {
    supabase
      .from('saved_recipes')
      .select('id, title, ingredients, steps, missing, macros, time_minutes, servings, tags, blurb')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setSaved(data.map(r => ({
          id: r.id, title: r.title, blurb: r.blurb,
          uses: r.ingredients || [], steps: r.steps || [],
          missing: r.missing || [], macros: r.macros || {},
          prep: r.time_minutes, serves: r.servings,
          tags: r.tags || [], expiringUsed: 0,
        })));
      });
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function normCat(c) { return c === 'Produce' ? 'Fruit & Veg' : (c ?? 'Other'); }
  function rowToItem(row) {
    return { id: row.id, name: row.name, qty: row.qty ?? '1', cat: normCat(row.category), days: daysFromDate(row.expiry_date), added: 0 };
  }
  function daysFromDate(dateStr) {
    if (!dateStr) return 7;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.round((new Date(dateStr) - today) / 86400000);
  }
  function dateFromDaysOffset(days) {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  const showToast = (msg, onUndo) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, onUndo });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

  // ── Fridge actions ────────────────────────────────────────────────────────
  const saveItem = async ({ name, qty, cat, days }) => {
    const expiry_date = dateFromDaysOffset(days);
    if (itemForm.editing) {
      const { error } = await supabase.from('fridge_items')
        .update({ name, qty, category: cat, expiry_date }).eq('id', itemForm.editing.id);
      if (!error) { setFridge(f => f.map(i => i.id === itemForm.editing.id ? { ...i, name, qty, cat, days } : i)); showToast('Item updated'); }
      else showToast('Failed to update item');
    } else {
      const { data, error } = await supabase.from('fridge_items')
        .insert({ user_id: user.id, name, qty, category: cat, expiry_date }).select('id').single();
      if (!error && data) { setFridge(f => [{ id: data.id, name, qty, cat, days, added: 0 }, ...f]); showToast(`${name} added to your fridge`); }
      else showToast('Failed to add item');
    }
    setItemForm({ open: false, editing: null });
  };

  const deleteItem = (item) => {
    setDetailItem(null);
    setFridge(f => f.filter(i => i.id !== item.id));
    if (pendingDeleteRef.current) {
      clearTimeout(pendingDeleteRef.current.timer);
      supabase.from('fridge_items').delete().eq('id', pendingDeleteRef.current.id);
    }
    const timer = setTimeout(() => { supabase.from('fridge_items').delete().eq('id', item.id); pendingDeleteRef.current = null; }, 5000);
    pendingDeleteRef.current = { id: item.id, timer };
    showToast(`${item.name} removed`, () => {
      clearTimeout(timer); pendingDeleteRef.current = null;
      setFridge(f => [...f, item].sort((a, b) => a.days - b.days)); setToast(null);
    });
  };

  const editItem = (item) => { setDetailItem(null); setItemForm({ open: true, editing: item }); };
  const cookWith = ()     => { setDetailItem(null); setRecipe(null); setTab('recipes'); };

  // ── Recipe actions ────────────────────────────────────────────────────────
  const generate = async () => {
    setGenerating(true);
    setHasGenerated(false);
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fridge: fridge.map(i => ({ name: i.name, qty: i.qty, days: i.days })),
          filters,
        }),
      });
      const data = await res.json();
      if (data.recipes?.length) {
        setGenerated(data.recipes);
        setHasGenerated(true);
      } else {
        showToast('Could not generate recipes — try again');
      }
    } catch {
      showToast('Could not reach AI — check your connection');
    } finally {
      setGenerating(false);
    }
  };

  const toggleFilter = (d) => setFilters(fs => fs.includes(d) ? fs.filter(x => x !== d) : [...fs, d]);

  const toggleSave = async (r) => {
    if (saved.find(x => x.id === r.id)) {
      const { error } = await supabase.from('saved_recipes').delete().eq('id', r.id);
      if (!error) { setSaved(s => s.filter(x => x.id !== r.id)); showToast('Removed from saved'); }
    } else {
      if (saved.length >= 20) { showToast('Saved is full (20 max)'); return; }
      const { data, error } = await supabase.from('saved_recipes')
        .insert({ user_id: user.id, title: r.title, blurb: r.blurb, ingredients: r.uses || [], steps: r.steps || [], missing: r.missing || [], macros: r.macros, time_minutes: r.prep, servings: r.serves, tags: r.tags || [] })
        .select('id').single();
      if (!error && data) { setSaved(s => [{ ...r, id: data.id }, ...s]); showToast('Recipe saved'); }
    }
  };

  const openRecipeById = (id) => {
    const r = [...generated, ...saved].find(x => x.id === id);
    if (r) setRecipe(r);
  };

  // ── Shopping actions ──────────────────────────────────────────────────────
  const addMissing = async (r) => {
    const existing = new Set(shopping.map(s => s.name.toLowerCase()));
    const toAdd = r.missing.filter(m => !existing.has(m.toLowerCase()));
    if (!toAdd.length) { showToast('Already on your list'); return; }
    const { data, error } = await supabase.from('shopping_items')
      .insert(toAdd.map(m => ({ user_id: user.id, name: m, category: guessCat(m), done: false })))
      .select('id, name, category, done');
    if (!error && data) {
      setShopping(s => [...s, ...data.map(row => ({ ...row, cat: row.category, source: 'ai' }))]);
      showToast(`${data.length} item${data.length === 1 ? '' : 's'} added to shopping`);
    } else {
      showToast('Could not add items'); console.error(error);
    }
  };

  const rebuy = async (item) => {
    setDetailItem(null);
    if (shopping.find(x => x.name.toLowerCase() === item.name.toLowerCase())) { showToast(`${item.name} already on list`); return; }
    const { data, error } = await supabase.from('shopping_items')
      .insert({ user_id: user.id, name: item.name, category: item.cat, done: false })
      .select('id').single();
    if (!error && data) {
      setShopping(s => [...s, { id: data.id, name: item.name, cat: item.cat, source: 'manual', done: false }]);
      showToast(`${item.name} added to shopping`);
    } else {
      showToast('Could not add item'); console.error(error);
    }
  };

  const toggleShop = async (id) => {
    const item = shopping.find(i => i.id === id);
    if (!item) return;
    setShopping(s => s.map(i => i.id === id ? { ...i, done: !i.done } : i));
    const { error } = await supabase.from('shopping_items').update({ done: !item.done }).eq('id', id);
    if (error) { setShopping(s => s.map(i => i.id === id ? { ...i, done: item.done } : i)); console.error(error); }
  };

  const addShop = async (name) => {
    const cat = guessCat(name);
    const tempId = `temp-${Date.now()}`;
    setShopping(s => [...s, { id: tempId, name, cat, source: 'manual', done: false }]);
    const { data, error } = await supabase.from('shopping_items')
      .insert({ user_id: user.id, name, category: cat, done: false })
      .select('id').single();
    if (!error && data) {
      setShopping(s => s.map(i => i.id === tempId ? { ...i, id: data.id } : i));
    } else {
      setShopping(s => s.filter(i => i.id !== tempId));
      showToast('Could not save item'); console.error(error);
    }
  };

  const clearTicked = async () => {
    const doneIds = shopping.filter(i => i.done).map(i => i.id);
    setShopping(s => s.filter(i => !i.done));
    if (doneIds.length) {
      const { error } = await supabase.from('shopping_items').delete().in('id', doneIds);
      if (error) { console.error(error); }
    }
    showToast('Ticked items cleared');
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const alerts = Object.values(
    fridge.filter(i => i.days <= 3).reduce((acc, item) => {
      const key = item.days;
      if (!acc[key]) acc[key] = { id: `alert-${key}`, items: [], days: key, when: key < 0 ? 'Expired' : key === 0 ? 'Today' : key === 1 ? 'Tomorrow' : `In ${key} days`, recipeId: null, read: false };
      acc[key].items.push(item.name);
      return acc;
    }, {})
  ).sort((a, b) => a.days - b.days);

  const savedIds   = new Set(saved.map(r => r.id));
  const alertCount = alerts.length;

  const finishOnboarding = () => { setOnboarded(true); LS.set('onboarded', true); setTab('fridge'); };

  const screenProps = {
    fridge, shopping, saved, generated, generating, hasGenerated,
    filters, alerts, notifOn, savedIds,
    onSaveItem:      saveItem,
    onDeleteItem:    deleteItem,
    onEditItem:      editItem,
    onCookWith:      cookWith,
    onGenerate:      generate,
    onToggleFilter:  toggleFilter,
    onToggleSave:    toggleSave,
    onOpenRecipeById: openRecipeById,
    onAddMissing:    addMissing,
    onRebuy:         rebuy,
    onToggleShop:    toggleShop,
    onAddShop:       addShop,
    onClearTicked:   clearTicked,
    onSetNotifOn:    setNotifOn,
    onOpenItem:      setDetailItem,
    onOpenRecipe:    setRecipe,
    onOpenAdd:       () => setItemForm({ open: true, editing: null }),
    onOpenSettings:  () => setSettingsOpen(true),
    onSetTab:        setTab,
    itemForm,
    detailItem,
    recipe,
    onCloseItemForm: () => setItemForm({ open: false, editing: null }),
    onCloseDetail:   () => setDetailItem(null),
    onCloseRecipe:   () => setRecipe(null),
    showToast,
  };

  const screens = {
    home:     <HomeScreen     {...screenProps} />,
    fridge:   <FridgeScreen   {...screenProps} />,
    recipes:  <RecipesScreen  {...screenProps} />,
    shopping: <ShoppingScreen {...screenProps} />,
    alerts:   <AlertsScreen   {...screenProps} />,
  };

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', background: 'var(--app-bg)' }}>
      <div
        key={tab}
        className="cmf-fade"
        style={{ minHeight: '100dvh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
      >
        {screens[tab]}
      </div>

      <TabBar active={tab} onChange={setTab} alertCount={alertCount} />
      <Toast toast={toast} />

      <ItemForm
        open={itemForm.open}
        editing={itemForm.editing}
        onClose={() => setItemForm({ open: false, editing: null })}
        onSave={saveItem}
      />
      <ItemDetail
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={editItem}
        onDelete={deleteItem}
        onCookWith={cookWith}
        onRebuy={rebuy}
      />
      <RecipeDetail
        recipe={recipe}
        fridge={fridge}
        saved={recipe ? savedIds.has(recipe.id) : false}
        onClose={() => setRecipe(null)}
        onSave={toggleSave}
        onAddMissing={addMissing}
      />

      {settingsOpen && (
        <SettingsScreen
          {...screenProps}
          user={user}
          onBack={() => setSettingsOpen(false)}
          onReplay={() => { setSettingsOpen(false); setOnboarded(false); }}
          onSignOut={() => { setSettingsOpen(false); supabase.auth.signOut(); }}
          onDeleteAllData={async () => {
            await Promise.all([
              supabase.from('fridge_items').delete().eq('user_id', user.id),
              supabase.from('shopping_items').delete().eq('user_id', user.id),
              supabase.from('saved_recipes').delete().eq('user_id', user.id),
            ]);
            setFridge([]); setShopping([]); setSaved([]);
            ['onboarded', 'tab', 'filters'].forEach(k => localStorage.removeItem('cmf_' + k));
            localStorage.removeItem('cmf_shop_history');
            setSettingsOpen(false);
            supabase.auth.signOut();
          }}
        />
      )}

      {!onboarded && <OnboardingScreen onDone={finishOnboarding} />}
    </div>
  );
}
