// [kcal, protein_g, fat_g, carbs_g] per 100g or 100ml
const DB = {
  // Dairy
  'milk':              [61,  3.2, 3.3, 4.8],
  'whole milk':        [61,  3.2, 3.3, 4.8],
  'semi-skimmed milk': [46,  3.5, 1.7, 5.0],
  'skimmed milk':      [34,  3.4, 0.1, 4.7],
  'oat milk':          [45,  1.0, 1.5, 6.6],
  'almond milk':       [15,  0.5, 1.2, 0.7],
  'coconut milk':      [197, 2.0, 21,  2.8],
  'soy milk':          [43,  3.3, 1.8, 3.1],
  'butter':            [717, 0.9, 81,  0.1],
  'cheddar':           [402, 25,  33,  1.3],
  'mature cheddar':    [402, 25,  33,  1.3],
  'mozzarella':        [280, 20,  22,  2.2],
  'parmesan':          [431, 38,  29,  3.2],
  'feta':              [264, 14,  21,  4.1],
  'brie':              [334, 20,  28,  0.5],
  'cream cheese':      [342, 5.9, 34,  3.9],
  'cottage cheese':    [98,  11,  4.3, 3.4],
  'goat cheese':       [364, 22,  30,  0.0],
  'halloumi':          [321, 22,  25,  2.0],
  'yogurt':            [59,  3.5, 3.3, 4.7],
  'greek yogurt':      [97,  9.0, 5.0, 3.6],
  'natural yogurt':    [59,  3.5, 3.3, 4.7],
  'sour cream':        [193, 2.1, 20,  4.3],
  'crème fraîche':     [300, 2.0, 31,  2.7],
  'single cream':      [193, 2.7, 19,  3.7],
  'double cream':      [449, 1.7, 48,  2.8],
  'eggs':              [143, 13,  10,  0.7],
  'free-range eggs':   [143, 13,  10,  0.7],

  // Fruit & Veg – vegetables
  'tomatoes':          [18,  0.9, 0.2, 3.5],
  'cherry tomatoes':   [18,  0.9, 0.2, 3.5],
  'vine tomatoes':     [18,  0.9, 0.2, 3.5],
  'beef tomatoes':     [18,  0.9, 0.2, 3.5],
  'chopped tomatoes':  [24,  1.5, 0.1, 4.8],
  'tinned tomatoes':   [24,  1.5, 0.1, 4.8],
  'onions':            [40,  1.1, 0.1, 9.3],
  'red onions':        [42,  1.2, 0.1, 9.6],
  'spring onions':     [32,  1.8, 0.5, 5.2],
  'shallots':          [72,  2.5, 0.1, 17],
  'garlic':            [149, 6.4, 0.5, 33],
  'ginger':            [80,  1.8, 0.8, 18],
  'potatoes':          [77,  2.0, 0.1, 17],
  'sweet potatoes':    [86,  1.6, 0.1, 20],
  'new potatoes':      [70,  1.6, 0.3, 16],
  'carrots':           [41,  0.9, 0.2, 10],
  'parsnips':          [75,  1.8, 1.2, 18],
  'beetroot':          [43,  1.7, 0.1, 10],
  'broccoli':          [34,  2.8, 0.4, 7.0],
  'cauliflower':       [25,  2.0, 0.3, 5.0],
  'cabbage':           [25,  1.3, 0.1, 5.8],
  'kale':              [49,  4.3, 0.9, 9.0],
  'spinach':           [23,  2.9, 0.4, 3.6],
  'baby spinach':      [23,  2.9, 0.4, 3.6],
  'rocket':            [25,  2.6, 0.7, 3.7],
  'lettuce':           [15,  1.4, 0.2, 2.9],
  'watercress':        [22,  2.3, 0.3, 1.3],
  'courgette':         [17,  1.2, 0.3, 3.1],
  'aubergine':         [25,  1.0, 0.2, 6.0],
  'pepper':            [31,  1.0, 0.3, 7.2],
  'red pepper':        [31,  1.0, 0.3, 7.2],
  'red peppers':       [31,  1.0, 0.3, 7.2],
  'yellow pepper':     [27,  1.0, 0.2, 6.3],
  'mushrooms':         [22,  3.1, 0.3, 3.3],
  'chestnut mushrooms':[22,  3.1, 0.3, 3.3],
  'cucumber':          [16,  0.7, 0.1, 3.6],
  'celery':            [14,  0.7, 0.1, 3.0],
  'leek':              [61,  1.5, 0.3, 14],
  'fennel':            [31,  1.2, 0.2, 7.3],
  'asparagus':         [20,  2.2, 0.1, 3.9],
  'green beans':       [31,  1.8, 0.1, 7.1],
  'peas':              [81,  5.4, 0.4, 14],
  'sweetcorn':         [86,  3.2, 1.2, 19],
  'avocado':           [160, 2.0, 15,  9.0],
  'edamame':           [122, 11,  5.0, 10],
  'chilli':            [40,  2.0, 0.4, 8.8],

  // Fruit & Veg – fruit
  'apples':            [52,  0.3, 0.2, 14],
  'bananas':           [89,  1.1, 0.3, 23],
  'oranges':           [47,  0.9, 0.1, 12],
  'lemons':            [29,  1.1, 0.3, 9.3],
  'limes':             [30,  0.7, 0.2, 11],
  'grapefruit':        [42,  0.8, 0.1, 11],
  'strawberries':      [33,  0.7, 0.3, 8.0],
  'raspberries':       [52,  1.2, 0.7, 12],
  'blueberries':       [57,  0.7, 0.3, 14],
  'blackberries':      [43,  1.4, 0.5, 10],
  'grapes':            [69,  0.7, 0.2, 18],
  'melon':             [34,  0.8, 0.2, 8.2],
  'mango':             [60,  0.8, 0.4, 15],
  'pineapple':         [50,  0.5, 0.1, 13],
  'peaches':           [39,  0.9, 0.3, 10],
  'pears':             [57,  0.4, 0.1, 15],
  'kiwi':              [61,  1.1, 0.5, 15],
  'dates':             [282, 2.5, 0.4, 75],

  // Protein – meat
  'chicken breast':    [165, 31,  3.6, 0.0],
  'chicken thighs':    [209, 26,  11,  0.0],
  'chicken wings':     [203, 20,  13,  0.0],
  'whole chicken':     [239, 27,  14,  0.0],
  'beef mince':        [254, 26,  16,  0.0],
  'steak':             [271, 26,  17,  0.0],
  'pork chops':        [231, 25,  14,  0.0],
  'pork mince':        [235, 25,  14,  0.0],
  'bacon':             [417, 12,  40,  1.4],
  'pancetta':          [449, 12,  45,  0.0],
  'ham':               [146, 20,  7.3, 0.5],
  'lamb mince':        [282, 27,  18,  0.0],
  'lamb chops':        [253, 28,  15,  0.0],
  'sausages':          [301, 11,  25,  7.4],
  'chorizo':           [455, 24,  38,  3.0],
  'salami':            [336, 22,  28,  1.2],
  'turkey mince':      [159, 22,  8.0, 0.0],
  'turkey breast':     [135, 30,  1.0, 0.0],

  // Protein – fish
  'salmon':            [208, 20,  13,  0.0],
  'salmon fillet':     [208, 20,  13,  0.0],
  'smoked salmon':     [142, 20,  6.0, 0.0],
  'cod':               [82,  18,  0.7, 0.0],
  'haddock':           [72,  17,  0.4, 0.0],
  'sea bass':          [97,  18,  3.0, 0.0],
  'tuna steak':        [144, 30,  2.0, 0.0],
  'tinned tuna':       [109, 25,  0.8, 0.0],
  'tinned sardines':   [185, 21,  11,  0.0],
  'prawns':            [99,  21,  1.4, 0.0],
  'king prawns':       [99,  21,  1.4, 0.0],
  'mussels':           [86,  12,  2.2, 4.5],

  // Protein – plant
  'tofu':              [76,  8.1, 4.2, 1.9],
  'firm tofu':         [76,  8.1, 4.2, 1.9],
  'silken tofu':       [55,  5.3, 2.7, 2.6],
  'tempeh':            [193, 19,  11,  9.4],
  'chickpeas':         [164, 8.9, 2.6, 27],
  'tinned chickpeas':  [119, 7.2, 1.9, 20],
  'lentils':           [116, 9.0, 0.4, 20],
  'red lentils':       [116, 9.0, 0.4, 20],
  'black beans':       [132, 8.9, 0.5, 24],
  'kidney beans':      [127, 8.7, 0.5, 23],
  'butter beans':      [103, 7.1, 0.4, 18],
  'cannellini beans':  [93,  6.7, 0.4, 17],

  // Pantry – grains
  'pasta':             [371, 13,  1.1, 75],
  'spaghetti':         [371, 13,  1.1, 75],
  'penne':             [371, 13,  1.1, 75],
  'rice':              [365, 7.1, 0.7, 80],
  'basmati rice':      [365, 7.1, 0.7, 80],
  'brown rice':        [362, 8.0, 2.9, 77],
  'jasmine rice':      [365, 7.1, 0.7, 80],
  'leftover rice':     [130, 2.7, 0.3, 28],
  'risotto rice':      [365, 7.1, 0.7, 80],
  'bread':             [265, 9.0, 3.2, 49],
  'sourdough':         [274, 9.5, 1.4, 55],
  'oats':              [389, 17,  7.0, 66],
  'granola':           [471, 10,  20,  64],
  'couscous':          [376, 13,  0.6, 77],
  'quinoa':            [368, 14,  6.1, 64],
  'noodles':           [138, 4.5, 2.0, 25],
  'rice noodles':      [364, 6.4, 0.6, 84],
  'udon noodles':      [134, 3.7, 0.6, 28],
  'polenta':           [362, 8.7, 3.6, 75],

  // Pantry – oils & condiments
  'olive oil':         [884, 0.0, 100, 0.0],
  'vegetable oil':     [884, 0.0, 100, 0.0],
  'coconut oil':       [862, 0.0, 100, 0.0],
  'sesame oil':        [884, 0.0, 100, 0.0],
  'honey':             [304, 0.3, 0.0, 82],
  'maple syrup':       [260, 0.1, 0.1, 67],
  'peanut butter':     [588, 25,  50,  20],
  'almond butter':     [614, 21,  56,  19],
  'tahini':            [595, 17,  54,  21],
  'dark chocolate':    [546, 5.0, 31,  60],
  'milk chocolate':    [535, 8.0, 30,  59],
  'cocoa powder':      [228, 20,  14,  55],

  // Drinks
  'orange juice':      [45,  0.7, 0.2, 11],
  'apple juice':       [47,  0.1, 0.1, 12],
  'coffee':            [2,   0.3, 0.0, 0.0],
  'wine':              [83,  0.1, 0.0, 2.6],
  'red wine':          [85,  0.1, 0.0, 2.5],
  'white wine':        [82,  0.1, 0.0, 2.6],
  'beer':              [43,  0.5, 0.0, 3.6],
};

export function getMacros(name) {
  const n = name.trim().toLowerCase();

  // 1. Exact match
  if (DB[n]) return fmt(DB[n]);

  // 2. DB key is contained in item name (e.g. "semi-skimmed milk" matches "milk")
  //    or item name is contained in DB key
  let best = null;
  let bestLen = 0;
  for (const key of Object.keys(DB)) {
    if (n.includes(key) || key.includes(n)) {
      if (key.length > bestLen) { best = key; bestLen = key.length; }
    }
  }
  if (best) return fmt(DB[best]);

  // 3. Word overlap — score by how many words match
  const words = n.split(/\s+/);
  let topScore = 0;
  let topKey   = null;
  for (const key of Object.keys(DB)) {
    const kw = key.split(/\s+/);
    const score = words.filter(w => kw.includes(w)).length;
    if (score > topScore) { topScore = score; topKey = key; }
  }
  if (topScore >= 1) return fmt(DB[topKey]);

  return null;
}

function fmt([kcal, protein, fat, carbs]) {
  return { kcal, protein, fat, carbs };
}
