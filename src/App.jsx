import { useState, useEffect, useRef } from 'react';
import {
  FRIDGE_SEED, GENERATED_SEED, SAVED_SEED, SHOPPING_SEED, ALERTS_SEED,
} from './data';
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
    Produce: ['tomato', 'onion', 'garlic', 'pepper', 'spinach', 'lemon', 'apple', 'carrot', 'herb', 'lime', 'dill'],
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
  const [tab, setTab]                   = useState('home');
  const [fridge, setFridge]             = useState(FRIDGE_SEED);
  const [shopping, setShopping]         = useState(SHOPPING_SEED);
  const [saved, setSaved]               = useState(() => LS.get('saved', SAVED_SEED));
  const [generated]                     = useState(GENERATED_SEED);
  const [generating, setGenerating]     = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [filters, setFilters]           = useState(() => LS.get('filters', []));
  const [alerts]                        = useState(ALERTS_SEED);
  const [notifOn, setNotifOn]           = useState(true);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [itemForm, setItemForm]         = useState({ open: false, editing: null });
  const [detailItem, setDetailItem]     = useState(null);
  const [recipe, setRecipe]             = useState(null);
  const [toast, setToast]               = useState(null);
  const toastTimer                      = useRef(null);

  useEffect(() => LS.set('saved', saved), [saved]);
  useEffect(() => LS.set('filters', filters), [filters]);

  const showToast = (msg, onUndo) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, onUndo });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

  // fridge actions
  const saveItem = ({ name, qty, cat, days }) => {
    if (itemForm.editing) {
      setFridge(f => f.map(i => i.id === itemForm.editing.id ? { ...i, name, qty, cat, days } : i));
      showToast('Item updated');
    } else {
      setFridge(f => [{ id: 'f' + Date.now(), name, qty, cat, days, added: 0 }, ...f]);
      showToast(`${name} added to your fridge`);
    }
    setItemForm({ open: false, editing: null });
  };

  const deleteItem = (item) => {
    setDetailItem(null);
    setFridge(f => f.filter(i => i.id !== item.id));
    showToast(`${item.name} removed`, () => {
      setFridge(f => [item, ...f].sort((a, b) => a.days - b.days));
      setToast(null);
    });
  };

  const editItem = (item) => { setDetailItem(null); setItemForm({ open: true, editing: item }); };
  const cookWith = ()     => { setDetailItem(null); setRecipe(null); setTab('recipes'); };

  // recipe actions
  const generate = () => {
    setGenerating(true); setHasGenerated(false);
    setTimeout(() => { setGenerating(false); setHasGenerated(true); }, 1700);
  };

  const toggleFilter = (d) =>
    setFilters(fs => fs.includes(d) ? fs.filter(x => x !== d) : [...fs, d]);

  const toggleSave = (r) => {
    setSaved(s => {
      if (s.find(x => x.id === r.id)) { showToast('Removed from saved'); return s.filter(x => x.id !== r.id); }
      if (s.length >= 20) { showToast('Saved is full (20 max)'); return s; }
      showToast('Recipe saved'); return [r, ...s];
    });
  };

  const openRecipeById = (id) => {
    const r = [...generated, ...saved, ...GENERATED_SEED, ...SAVED_SEED].find(x => x.id === id);
    if (r) setRecipe(r);
  };

  const addMissing = (r) => {
    const existing = new Set(shopping.map(s => s.name.toLowerCase()));
    const toAdd = r.missing
      .filter(m => !existing.has(m.toLowerCase()))
      .map(m => ({ id: 'sh' + Date.now() + m, name: m, cat: guessCat(m), source: 'ai', done: false }));
    setShopping(s => [...s, ...toAdd]);
    showToast(toAdd.length
      ? `${toAdd.length} item${toAdd.length === 1 ? '' : 's'} added to shopping`
      : 'Already on your list');
  };

  const rebuy = (item) => {
    setDetailItem(null);
    setShopping(s => s.find(x => x.name.toLowerCase() === item.name.toLowerCase())
      ? s
      : [...s, { id: 'sh' + Date.now(), name: item.name, cat: item.cat, source: 'manual', done: false }]);
    showToast(`${item.name} added to shopping`);
  };

  // shopping actions
  const toggleShop  = (id)   => setShopping(s => s.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const addShop     = (name) => setShopping(s => [
    ...s, { id: 'sh' + Date.now(), name, cat: guessCat(name), source: 'manual', done: false },
  ]);
  const clearTicked = () => { setShopping(s => s.filter(i => !i.done)); showToast('Ticked items cleared'); };

  const savedIds   = new Set(saved.map(r => r.id));
  const alertCount = alerts.filter(a => !a.read).length;

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
        />
      )}

      {!onboarded && <OnboardingScreen onDone={finishOnboarding} />}
    </div>
  );
}
