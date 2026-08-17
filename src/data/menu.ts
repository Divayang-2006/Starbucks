/**
 * The Starbucks India catalogue, captured from the live ordering site on
 * 2026-08-14 and shaped to the taxonomy the app already renders
 * ([`APP_METADATA.md`](../../docs/APP_METADATA.md) §5).
 *
 * **This is the national catalogue, not a store's menu.** starbucks.in serves it
 * before you pick a store, which is exactly what a UI recreation wants: a real
 * store's menu is a subset that changes by city, hour and stock, and seeding
 * from one would make half the screens look empty for no reason a reader could
 * see. `inStock` is therefore not modelled — everything here is orderable
 * somewhere.
 *
 * ## What was left out, and why
 *
 * The feed carries more than the app shows. Four kinds of row are dropped here
 * because they are not products a customer can put in a cart:
 *
 * - **Partner training items** (`Coffee Master Certification`, 7 rows) — an
 *   internal category, flagged `hideForCustomer` in the source.
 * - **Subscription-only beverages** (`Subscription Other Beverages`, 15 rows) —
 *   they belong to the Beverage Subscription programme, not the menu, and are
 *   likewise `hideForCustomer`.
 * - **Empty shells** (`Bottled Beverage`, `Pizzas & Sandwiches`) — categories
 *   that exist in the taxonomy with zero items behind them.
 * - **Duplicate SKUs.** The feed lists 254 rows for 209 espresso-to-merch
 *   products: a live row with a photo and calories, and a stale twin of the same
 *   SKU carrying neither. Collapsed to the richer of the two.
 *
 * ## Two fields that need a warning
 *
 * - **`veg` is only meaningful on drinks and food.** Merchandise and packaged
 *   coffee inherit whatever the row happened to carry — a ceramic mug comes
 *   through as non-veg and a glass tumbler as veg. It is omitted on those
 *   categories rather than passed through as noise, so the FSSAI diet mark must
 *   not be drawn for them.
 * - **`photo` is a source reference, not an asset.** These are the CDN files the
 *   real app serves, kept so each item can be matched to the shot it should be
 *   generated from — see [`PRODUCT_IMAGERY.md`](../../docs/PRODUCT_IMAGERY.md).
 *   Seven drinks have no photo in the feed at all and carry no `photo` here.
 *
 * Prices are the GST-inclusive rupee values the site displays, paise and all.
 *
 * ## Refreshing this file
 *
 * There is no public menu API — the endpoint sits behind a WAF. The site instead
 * caches the whole catalogue in `localStorage.menuListItem` on starbucks.in,
 * lz-string compressed, so the cheapest refresh is to open `/ordering`, run
 * `LZString.decompress` over that key and re-derive this file from the JSON.
 * Scraping the rendered cards works too but truncates names at 30 characters.
 */

/** The cup ladder. Not every drink offers all four. */
export type SizeName = 'SHORT' | 'TALL' | 'GRANDE' | 'VENTI';

/** Merchandising flags the feed sets per item; drives the chips and rails. */
export type ItemTag = 'new' | 'popular' | 'featured';

export interface MenuItem {
   /** Starbucks India SKU — stable across the feed, and the join key for `CURATED`. */
   sku: string;
   name: string;
   /** Rupees, GST-inclusive, for the default size. */
   price: number;
   /** Calories for the default size. Absent where the feed carries none. */
   kcal?: number;
   /** Default size — the one the card shows and the one `price` is for. */
   size?: SizeName;
   /** Millilitres for the default size, where the feed states it. */
   ml?: number;
   /** Sizes offered, cup order. Single-size items omit this. */
   sizes?: readonly SizeName[];
   /** Food only: portion the calories are measured over, e.g. `'203 g'`. */
   serve?: string;
   /** Drinks and food only — see the file header. */
   veg?: boolean;
   tags?: readonly ItemTag[];
   /** CDN filename of the reference photo. See the file header. */
   photo?: string;
}

export interface MenuSubCategory {
   name: string;
   items: readonly MenuItem[];
}

export interface MenuCategory {
   /** Stable key for routing and lookups. */
   key: string;
   name: string;
   /**
    * Whether the category is one of the four top-level tabs. `Ready to Eat` is
    * the odd one out: the site reaches it only through the category chip, so it
    * has products but no tab of its own.
    */
   tab: boolean;
   subCategories: readonly MenuSubCategory[];
}

/** §5 — the segmented control above the chips. Derived, so it cannot drift. */
export const MENU_TABS: readonly string[] = ['Drinks', 'Food', 'At Home Coffee', 'Merchandise'];

/**
 * §5 — the eight circular chips, in the site's order. Five name a real category
 * in `MENU`; `New Launch`, `Best Seller` and `Power Picks` are curated views and
 * resolve through `CURATED`.
 */
export const CATEGORY_CHIPS: readonly string[] = [
   'New Launch',
   'Best Seller',
   'Drinks',
   'Food',
   'Merch',
   'At Home Coffee',
   'Ready to Eat',
   'Power Picks',
];

/** Where `photo` filenames resolve. */
export const PHOTO_BASE = 'https://starbucksstatic.cognizantorderserv.com/Items/Small/';

export const MENU: readonly MenuCategory[] = [
   {
      key: 'drinks',
      name: 'Drinks',
      tab: true,
      subCategories: [
         {
            name: 'Espresso',
            items: [
               { sku: '118468', name: 'Ube Coconut Latte', price: 456.75, kcal: 169, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '118468.jpg' },
               { sku: '117064', name: 'Black Palm Jaggery Latte', price: 393.75, kcal: 197, size: 'SHORT', sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '117064.jpg' },
               { sku: '118460', name: 'Apricot Iced Shaken Espresso', price: 414.75, kcal: 140, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '118460.jpg' },
               { sku: '116547', name: 'Hazelnut Oat Iced Shaken Espresso', price: 367.5, kcal: 120, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: 'M116547.jpg' },
               { sku: '115017', name: 'Blonde Jaggery Oat Latte', price: 425.25, kcal: 107, size: 'SHORT', ml: 237, veg: true, photo: '112540.jpg' },
               { sku: '117864', name: 'Short Hazelnut Flat White Unsweetened', price: 441, kcal: 104, size: 'SHORT', veg: true, photo: '117864.png' },
               { sku: '115790', name: 'Tamrind Shikanji Cold brew', price: 393.75, kcal: 55, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE'], veg: true, photo: '115790.png' },
               { sku: '118292', name: 'Tall Iced Shaken Espresso with Vanilla Protein Foam', price: 420, kcal: 211, size: 'TALL', veg: true, photo: '118292.jpg' },
               { sku: '113846', name: 'Iced Belgium Chocolate Latte', price: 498.75, kcal: 311, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, tags: ['new'], photo: '113849.png' },
               { sku: '115010', name: 'Blonde Almond Latte', price: 425.25, kcal: 64, size: 'SHORT', ml: 237, veg: true, photo: '112540.jpg' },
               { sku: '117858', name: 'Short Double Blonde Vanilla Cappuccino Unsweetened', price: 477.75, kcal: 66, size: 'SHORT', veg: true, photo: '117858.png' },
               { sku: '117855', name: 'Tall Iced Vanilla Latte with Vanilla Protein Foam', price: 488.25, kcal: 244, veg: true, photo: '117855.png' },
               { sku: '117861', name: 'Tall Iced Caramel Latte Unsweetneed', price: 441, kcal: 122, size: 'TALL', veg: true, photo: '117861.png' },
               { sku: '115050', name: 'Brown Sugar Cinnamon Iced Shaken Espresso', price: 367.5, kcal: 117, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: 'M115050.jpg' },
               { sku: '114996', name: 'Honey Almond Flat White', price: 435.75, kcal: 89, size: 'SHORT', ml: 237, veg: true, photo: '103973.jpg' },
               { sku: '115003', name: 'Honey Oat Flat White', price: 435.75, kcal: 114, size: 'SHORT', ml: 237, veg: true, photo: '103973.jpg' },
               { sku: '116538', name: 'Hazelnut Oat Cortado', price: 435.75, kcal: 69, veg: true, photo: '107329.jpg' },
               { sku: '118132', name: 'Malabar Coconut Flat White', price: 456.75, kcal: 257, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL'], veg: true, photo: '118132.jpg' },
               { sku: '118489', name: 'Ube Iced Shaken Espresso', price: 456.75, kcal: 267, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '118489.jpg' },
               { sku: '118463', name: 'Iced Coconut Matcha', price: 472.5, kcal: 117, veg: true, photo: '118463.jpg' },
               { sku: '118464', name: 'Iced Strawberry Matcha', price: 472.5, kcal: 274, veg: true, photo: '118464.jpg' },
               { sku: '100391', name: 'Caffè Mocha', price: 393.75, kcal: 212, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100391.jpg' },
               { sku: '100433', name: 'Caffe Americano', price: 325.5, kcal: 0, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100433.jpg' },
               { sku: '107934', name: 'Chocolate Cortado', price: 399, kcal: 88, serve: '120 ml', veg: true, photo: '107934.jpg' },
               { sku: '100377', name: 'Caffe Latte', price: 336, kcal: 104, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100377.jpg' },
               { sku: '107329', name: 'Cortado', price: 346.5, kcal: 72, serve: '120 ml', veg: true, photo: '107329.jpg' },
               { sku: '100405', name: 'Caramel Macchiato', price: 430.5, kcal: 162, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100405.jpg' },
               { sku: '104068', name: 'Chocolate Cappuccino', price: 409.5, kcal: 152, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '104068.jpg' },
               { sku: '107933', name: 'Hazelnut Cortado', price: 399, kcal: 76, serve: '120 ml', veg: true, photo: '107933.jpg' },
               { sku: '100419', name: 'Cappuccino', price: 336, kcal: 104, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100419.jpg' },
               { sku: '100399', name: 'Iced Caffè Mocha', price: 430.5, kcal: 273, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100399.jpg' },
               { sku: '100512', name: 'Doppio Espresso', price: 320.25, kcal: 0, veg: true, photo: '100512.jpg' },
               { sku: '103973', name: 'Flat White', price: 372.75, kcal: 104, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '103973.jpg' },
               { sku: '100427', name: 'Iced Cappuccino', price: 372.75, kcal: 214, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100427.jpg' },
               { sku: '100413', name: 'Iced Caramel Macchiato', price: 467.25, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true },
               { sku: '104072', name: 'Iced Chocolate Cappuccino', price: 446.25, kcal: 161, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '104072.jpg' },
               { sku: '100441', name: 'Iced Caffè Americano', price: 362.25, kcal: 0, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100441.jpg' },
               { sku: '100385', name: 'Iced Caffè Latte', price: 372.75, kcal: 122, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100385.jpg' },
               { sku: '108056', name: 'Iced Velvet Vanilla Latte', price: 467.25, kcal: 310, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '108056.jpg' },
               { sku: '100485', name: 'Iced White Mocha', price: 435.75, kcal: 318, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100485.jpg' },
               { sku: '113842', name: 'Belgium Chocolate Latte', price: 456.75, kcal: 224, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, tags: ['new'], photo: 'B113842.jpg' },
               { sku: '100511', name: 'Solo Espresso', price: 294, kcal: 0, veg: true, photo: '100511.jpg' },
               { sku: '107932', name: 'Vanilla Cortado', price: 399, kcal: 74, serve: '120 ml', veg: true, photo: '107932.jpg' },
               { sku: '108052', name: 'Velvet Vanilla Latte', price: 430.5, kcal: 225, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '108052.jpg' },
               { sku: '100477', name: 'White Chocolate Mocha', price: 399, kcal: 242, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100477.jpg' },
               { sku: '112155', name: 'Vanilla Caffe Latte', price: 404.25, kcal: 153, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '112155.jpg' },
               { sku: '112185', name: 'Iced Vanilla Latte', price: 441, kcal: 181, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '112185.jpg' },
               { sku: '112188', name: 'Iced Hazelnut Latte', price: 441, kcal: 194, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '112188.jpg' },
               { sku: '112162', name: 'Hazelnut Caffe Latte', price: 404.25, kcal: 162, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '112162.jpg' },
            ],
         },
         {
            name: 'Frappuccino® Blended Beverages',
            items: [
               { sku: '118458', name: 'Tiramisu Frappuccino', price: 588, kcal: 655, size: 'TALL', sizes: ['TALL', 'GRANDE'], veg: true, photo: '118458.jpg' },
               { sku: '113849', name: 'Belgium Chocolate Frappuccino', price: 535.5, kcal: 388, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, tags: ['new'], photo: 'B113849.jpg' },
               { sku: '117865', name: 'Tall Caramel Frappuccino with Banana Foam', price: 488.25, kcal: 244, veg: true, photo: '117865.png' },
               { sku: '113852', name: 'Belgium Chocolate Cream Frappuccino', price: 535.5, kcal: 410, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, tags: ['new'], photo: 'B113849.jpg' },
               { sku: '100465', name: 'Mocha Frappuccino', price: 477.75, kcal: 261, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100465.jpg' },
               { sku: '103515', name: 'Double Chocolate Chip Frappuccino', price: 477.75, kcal: 344, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '103515.jpg' },
               { sku: '103813', name: 'Caramel Java Chip Frappuccino', price: 514.5, kcal: 328, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '103813.jpg' },
               { sku: '100518', name: 'Coffee Frappuccino', price: 414.75, kcal: 153, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100518.jpg' },
               { sku: '100468', name: 'Espresso Frappuccino', price: 451.5, kcal: 139, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100468.jpg' },
               { sku: '100501', name: 'Java Chip Frappuccino', price: 456.75, kcal: 329, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100501.jpg' },
               { sku: '100474', name: 'Green Tea Cream Frappuccino', price: 488.25, kcal: 339, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100474.jpg' },
               { sku: '100471', name: 'Vanilla Cream Frappuccino', price: 451.5, kcal: 272, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100471.jpg' },
               { sku: '103845', name: 'Strawberries and Crème Frappuccino', price: 451.5, kcal: 457, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '103845.jpg' },
               { sku: '100507', name: 'White Mocha Frappuccino', price: 467.25, kcal: 297, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100507.jpg' },
               { sku: '105468', name: 'Cold coffee', price: 414.75, kcal: 354, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '105468.jpg' },
               { sku: '100504', name: 'Caramel Frappuccino', price: 451.5, kcal: 284, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100504.jpg' },
            ],
         },
         {
            name: 'Other Beverages',
            items: [
               { sku: '118282', name: 'Iced Mango Matcha', price: 414.75, kcal: 290, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '118282.jpg' },
               { sku: '114038', name: 'Strawberry Acai Lemonade', price: 409.5, kcal: 88, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '114038.jpg' },
               { sku: '103477', name: 'Valencia Orange Peach Refresher', price: 351.75, kcal: 73, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '103477.png' },
               { sku: '116731', name: 'Strawberry Acai Refresher', price: 362.25, kcal: 54, size: 'TALL', ml: 354, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '116731.png' },
               { sku: '116733', name: 'Lychee Raspberry Refresher', price: 362.25, kcal: 67, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '116733.png' },
               { sku: '100447', name: 'Signature Hot Chocolate', price: 362.25, kcal: 284, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100447.jpg' },
               { sku: '112567', name: 'Chocolate Milkshake', price: 441, kcal: 632, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '112567.jpg' },
               { sku: '116732', name: 'Mango Dragonfruit Refresher', price: 362.25, kcal: 62, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '116732.png' },
               { sku: '100515', name: 'Iced Signature Chocolate', price: 399, kcal: 356, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100515.jpg' },
               { sku: '112573', name: 'Vanilla Milkshake', price: 441, kcal: 531, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '112573.jpg' },
               { sku: '112570', name: 'Strawberry Milkshake', price: 441, kcal: 569, size: 'TALL', sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '112570.jpg' },
            ],
         },
         {
            name: 'Brewed Coffee',
            items: [
               { sku: '118504', name: '4Cup French Press Kati Kati Blend', price: 414.75, kcal: 0, veg: true, photo: 'Americano.jpg' },
               { sku: '118472', name: 'Pour Over Kati Kati Blend', price: 341.25, kcal: 0, size: 'SHORT', sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: 'Americano.jpg' },
               { sku: '105063', name: 'Chemex Kenya', price: 383.25, kcal: 0, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE'], veg: true, photo: '105063.jpg' },
               { sku: '103606', name: 'Pour Over India Estates Blend', price: 341.25, kcal: 0, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '103606.jpg' },
               { sku: '105067', name: 'Chemex India Estates Blend', price: 383.25, kcal: 0, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE'], veg: true, photo: '105067.jpg' },
               { sku: '105065', name: 'Chemex Italian Roast', price: 383.25, kcal: 0, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE'], veg: true, photo: '105065.jpg' },
               { sku: '112563', name: 'Filter Coffee', price: 336, kcal: 226, size: 'SHORT', ml: 237, veg: true, photo: '112760.jpg' },
               { sku: '105061', name: 'Chemex Sumatra', price: 383.25, kcal: 0, serve: '354 ml', size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE'], veg: true, photo: '105061.jpg' },
               { sku: '102157', name: 'Pour Over Sumatra', price: 341.25, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '102157.jpg' },
               { sku: '109266', name: 'Chemex - Blond Roast', price: 383.25, kcal: 0, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE'], veg: true, photo: '109266.jpg' },
               { sku: '102153', name: 'Pour Over - Italian Blend', price: 341.25, kcal: 0, size: 'SHORT', ml: 237, sizes: ['SHORT', 'GRANDE', 'VENTI'], veg: true, photo: '102153.jpg' },
               { sku: '102149', name: 'Pour Over - Kenya Blend', price: 341.25, kcal: 0, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '102149.jpg' },
               { sku: '100727', name: 'French Press - Sumatra Blend', price: 414.75, kcal: 0, serve: '473 ml', veg: true, photo: '100727.jpg' },
               { sku: '100728', name: 'French Press - Kenya', price: 414.75, kcal: 0, veg: true, photo: '100728.jpg' },
               { sku: '100729', name: 'French Press - Italian', price: 414.75, kcal: 0, serve: '473 ml', veg: true, photo: '100729.jpg' },
               { sku: '103603', name: 'French Press - India Estates Blend', price: 414.75, kcal: 0, serve: '473 ml', veg: true, photo: '103603.jpg' },
            ],
         },
         {
            name: 'Tea',
            items: [
               { sku: '100367', name: 'Chai Tea Latte', price: 351.75, kcal: 174, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100367.jpg' },
               { sku: '100491', name: 'Iced Shaken Hibiscus and Passion Lemonade', price: 393.75, kcal: 74, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100491.jpg' },
               { sku: '104783', name: 'Iced Matcha and Espresso Fusion', price: 525, kcal: 137, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '104783.jpg' },
               { sku: '104719', name: 'Iced English Breakfast Black Tea', price: 346.5, kcal: 0, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '104719.jpg' },
               { sku: '100374', name: 'Iced Shaken Black Tea', price: 388.5, kcal: 74, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100374.jpg' },
               { sku: '104715', name: 'English Breakfast Black Tea', price: 346.5, kcal: 0, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '104715.jpg' },
               { sku: '104778', name: 'India Spice Majesty Blend (Full Pot)', price: 535.5, kcal: 13, veg: true, photo: '104778.jpg' },
               { sku: '104736', name: "Emperor'S Clouds And Mist Green Tea", price: 346.5, kcal: 0, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '104736.jpg' },
               { sku: '104740', name: "Iced Emperor'S Clouds And Mist Green Tea", price: 346.5, kcal: 0, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true, photo: '104740.jpg' },
               { sku: '100364', name: 'Iced Green Tea Latte', price: 388.5, kcal: 171, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE'], veg: true, photo: '100364.jpg' },
               { sku: '112554', name: 'Masala Chai', price: 336, kcal: 237, serve: '237 ml', size: 'SHORT', ml: 237, veg: true, photo: '112554.jpg' },
               { sku: '100360', name: 'Green Tea Latte', price: 351.75, kcal: 171, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '100360.jpg' },
               { sku: '100371', name: 'Iced Chai Tea Latte', price: 388.5, size: 'TALL', ml: 354, veg: true },
               { sku: '100357', name: 'Iced Shaken Green Tea', price: 388.5, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true },
               { sku: '104779', name: 'Matcha & Espresso Fusion', price: 467.25, size: 'SHORT', sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true },
            ],
         },
         {
            name: 'Cold Brew',
            items: [
               { sku: '118457', name: 'Tiramisu Cold Brew', price: 488.25, kcal: 462, veg: true, photo: '118457.jpg' },
               { sku: '115313', name: 'Vietnamese Cold Brew', price: 393.75, kcal: 220, size: 'SHORT', sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '108059.jpg' },
               { sku: '115283', name: 'Cold Brew with Ginger Ale', price: 393.75, kcal: 130, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '115283.jpg' },
               { sku: '118285', name: 'Sparkling Pineapple Cold Brew', price: 393.75, kcal: 82, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE'], veg: true, photo: '118285.jpg' },
               { sku: '115314', name: 'Cold Brew with Vanilla Sweet Cream', price: 372.75, kcal: 54, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '105000.jpg' },
               { sku: '111130', name: 'Nitro Cold Brew With Salted Foam', price: 493.5, kcal: 237, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE'], veg: true, photo: '111130.jpg' },
               { sku: '116799', name: 'Zesty Orange Cold Brew', price: 383.25, kcal: 52, size: 'SHORT', sizes: ['SHORT', 'TALL', 'GRANDE'], veg: true, tags: ['new'], photo: '116799.png' },
               { sku: '117868', name: 'Tall Cold Brew with Chocolate Protein Foam', price: 414.75, kcal: 141, veg: true, photo: '117868.png' },
               { sku: '107607', name: 'Nitro Cold Brew Iced', price: 451.5, kcal: 0, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE'], veg: true, photo: '107607.jpg' },
               { sku: '111133', name: 'Nitro Cold Brew with Ginger Ale', price: 535.5, kcal: 130, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE'], veg: true, photo: '111133_1.png' },
               { sku: '109304', name: 'Cold Brew with Salted Foam', price: 378, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: false },
               { sku: '105000', name: 'Tall Vanilla Sweet Cream Cold Brew', price: 399, size: 'TALL', ml: 354, sizes: ['TALL', 'GRANDE', 'VENTI'], veg: true },
               { sku: '107355', name: 'Nitro Cold Brew Float', price: 556.5, kcal: 436, serve: '415 ml', veg: true, photo: '107355.jpg' },
               { sku: '115312', name: 'Cold Brew Black', price: 320.25, kcal: 0, size: 'SHORT', sizes: ['SHORT', 'TALL', 'GRANDE', 'VENTI'], veg: true, photo: '104997.jpg' },
               { sku: '107608', name: 'Nitro Vanilla Sweet Cream Cold Brew', price: 488.25, kcal: 35, size: 'SHORT', ml: 237, sizes: ['SHORT', 'TALL', 'GRANDE'], veg: true, photo: '107608.jpg' },
               { sku: '111129', name: 'Vietnamese Nitro Cold Brew', price: 493.5, kcal: 199, size: 'SHORT', ml: 237, sizes: ['SHORT', 'GRANDE'], veg: true, photo: '111129.jpg' },
            ],
         },
      ],
   },
   {
      key: 'food',
      name: 'Food',
      tab: true,
      subCategories: [
         {
            name: 'Sandwiches & Wraps',
            items: [
               { sku: '117700', name: 'Avocado Panini Sandwich', price: 472.5, kcal: 490, serve: '203 g', veg: true, photo: '117700.png' },
               { sku: '118429', name: 'Green veggie protein wrap', price: 393.75, kcal: 617, serve: '170 g', veg: true, photo: '118429.jpg' },
               { sku: '118577', name: 'Mediterranean Guacamole Sandwich', price: 441, kcal: 452, serve: '190 g', veg: true, photo: '118577.jpg' },
               { sku: '117699', name: 'Grilled Paneer Cubano', price: 309.75, kcal: 1009, serve: '268 g', veg: true, photo: '117699.png' },
               { sku: '117678', name: 'Chicken Ham Croissant Sandwich', price: 367.5, kcal: 650, serve: '215 g', veg: false, photo: '117678.png' },
               { sku: '118428', name: 'Smoked Chicken Protein Wrap', price: 399, kcal: 428, serve: '170 g', veg: false, photo: '118428.jpg' },
               { sku: '118572', name: 'Mushroom Melt Sandwich', price: 304.5, kcal: 727, serve: '185 g', veg: true, photo: '118572.jpg' },
               { sku: '117683', name: 'Irani Chicken Kheema Wrap', price: 325.5, kcal: 426, serve: '205 g', veg: false, photo: '117683.png' },
               { sku: '118576', name: 'Egg and Spinach Protein Wrap', price: 336, kcal: 501, serve: '185 g', veg: false, photo: '118576.jpg' },
               { sku: '117680', name: 'Smoked Paprika & Tomato Chicken Sandwich', price: 299.25, kcal: 479, serve: '205 g', veg: false, photo: '117680.png' },
               { sku: '117682', name: 'Smoked Chicken Sausage Cubano', price: 325.5, kcal: 671, serve: '260 g', veg: false, photo: '117682.png' },
               { sku: '117701', name: 'Paneer Tikka Wrap', price: 309.75, kcal: 713, serve: '210 g', veg: true, photo: '117701.png' },
               { sku: '117681', name: 'Kalimiri Chicken Sandwich', price: 299.25, kcal: 576, serve: '215 g', veg: false, photo: '117681.png' },
               { sku: '104108', name: 'Chilli Cheese Toast', price: 378, kcal: 479, serve: '140 g', veg: true, photo: '104108.jpg' },
               { sku: '115583', name: 'Spinach & Corn Sandwich', price: 288.75, kcal: 541, serve: '200 g', veg: true, photo: '115583_1.png' },
               { sku: '116873', name: 'Chicken Tikka Sandwich', price: 346.5, kcal: 609, serve: '180 g', veg: false, tags: ['new'], photo: '116873.png' },
            ],
         },
         {
            name: 'Croissants & More',
            items: [
               { sku: '117903', name: 'Chocolate Croissant', price: 330.75, kcal: 614, serve: '100 g', veg: true, photo: '117903.png' },
               { sku: '116685', name: 'Veg Butter Croissant With Add On Preserv', price: 336, veg: true },
               { sku: '104038', name: 'Veg Penne Pasta With Cheese Sauce', price: 388.5, kcal: 529, serve: '340 g', veg: true, photo: '104038.jpg' },
               { sku: '104039', name: 'Non-Veg Penne Pasta With Cheese Sauce', price: 393.75, kcal: 577, serve: '350 g', veg: false, photo: '104039.jpg' },
               { sku: '117694', name: 'Brown Butter Hazelnut Cookie', price: 278.25, kcal: 386, serve: '75 g', veg: true },
               { sku: '104362', name: 'Egg White & Chicken in Multigrain Croissant', price: 404.25, kcal: 739, serve: '200 g', veg: false, photo: '104362.jpg' },
               { sku: '112737', name: 'Three Dip Chips', price: 304.5, kcal: 497, serve: '180 g', veg: true, photo: '112737.jpg' },
               { sku: '115799', name: 'Vanilla Ice cream croissant', price: 404.25, kcal: 421, serve: '125 g', veg: false, photo: '115799.png' },
               { sku: '116054', name: 'Cheese Peri Peri Pop Fries', price: 204.75, kcal: 380, serve: '163 g', veg: true, photo: '116054.png' },
               { sku: '116053', name: 'Masala Crispers', price: 215.25, kcal: 312, serve: '163 g', veg: true, photo: '116053.png' },
            ],
         },
         {
            name: 'Cookies & Desserts',
            items: [
               { sku: '118427', name: 'Berry Cocoa Crunch Parfait', price: 414.75, kcal: 297, serve: '105 g', veg: true, photo: '118427.jpg' },
               { sku: '117992', name: 'Vanilla Custard Muffin', price: 273, kcal: 748, serve: '140 g', veg: true, photo: '117992.png' },
               { sku: '103689', name: 'Banana Chocolate Loaf Cake', price: 351.75, kcal: 482, serve: '125 g', veg: false, tags: ['featured'], photo: '103689.jpg' },
               { sku: '112592', name: 'Chocolate Truffle Pastry', price: 425.25, kcal: 575, serve: '100 g', veg: true, photo: '112592.jpg' },
               { sku: '114939', name: 'Cold Brew Tiramisu', price: 446.25, kcal: 431, serve: '120 g', veg: false, photo: '114939_1.png' },
               { sku: '117129', name: 'Choco Kunafa Pastry', price: 409.5, kcal: 552, serve: '100 g', veg: true, photo: '117129.png' },
            ],
         },
         {
            name: 'Puffs & Pies',
            items: [
               { sku: '108177', name: 'Creamy Spinach & Corn Pocket', price: 283.5, kcal: 497, serve: '160 g', veg: true, photo: '118587.jpg' },
               { sku: '117674', name: 'Curried Chicken Bagel', price: 309.75, kcal: 504, serve: '200 g', veg: false, photo: '117674.png' },
               { sku: '113004', name: 'Masala Potato Puff', price: 199.5, kcal: 374, serve: '90 g', veg: true, photo: '113004.jpg' },
            ],
         },
         {
            name: 'Bakery',
            items: [
               { sku: '117675', name: 'Chicken Sheperds Pie', price: 299.25, kcal: 605, serve: '200 g', veg: false, photo: '117675.png' },
               { sku: '118055', name: 'Apple Pie Danish', price: 252, kcal: 274, serve: '70 g', veg: true, photo: '118055.jpg' },
               { sku: '118056', name: 'Nutty Pesto Twist', price: 267.75, kcal: 320, serve: '70 g', veg: true, photo: '118056.jpg' },
               { sku: '118053', name: 'Mushroom Feta Danish', price: 273, kcal: 331, serve: '80 g', veg: true, photo: '118053.jpg' },
               { sku: '118054', name: 'Lemon Pie Danish', price: 246.75, kcal: 211, serve: '70 g', veg: true, photo: '118054.jpg' },
               { sku: '117671', name: 'Twice Baked Almond Croissant', price: 309.75, kcal: 765, serve: '160 g', veg: false, photo: '117671.png' },
               { sku: '117690', name: 'Cruffin with Cherry Compote', price: 309.75, kcal: 674, serve: '175 g', veg: true, photo: '117690.png' },
               { sku: '117686', name: 'Korean Cream Cheese Kouign Amman', price: 351.75, kcal: 522, serve: '130 g', veg: true, photo: '117686.png' },
               { sku: '117687', name: 'Mushroom Broccoli Quiche', price: 283.5, kcal: 398, serve: '135 g', veg: true, photo: '117687.png' },
               { sku: '117688', name: 'Hazelnut PAC', price: 367.5, kcal: 576, serve: '120 g', veg: true, photo: '117688.png' },
               { sku: '117689', name: 'Dark Chocolate Babka', price: 351.75, kcal: 566, serve: '125 g', veg: true, photo: '117689.png' },
            ],
         },
      ],
   },
   {
      key: 'at-home-coffee',
      name: 'At Home Coffee',
      tab: true,
      subCategories: [
         {
            name: 'Wholebeans',
            items: [
               { sku: '118422', name: 'Starbucks Kati Kati Blend Whole Bean 250g', price: 2050, photo: '118422.jpg' },
               { sku: '117261', name: 'Italian Roast 150 G', price: 650, photo: 'A117261.png' },
               { sku: '117435', name: 'Karadibetta Estate 150 G', price: 495, photo: 'A117435.png' },
               { sku: '117263', name: 'Sumatra 150 G', price: 650, photo: 'A117263.png' },
               { sku: '117260', name: 'India Estates Blend 150 G', price: 495, photo: 'A117260.png' },
               { sku: '117437', name: 'Nullore Estate 150 G', price: 495, photo: 'A117437.png' },
               { sku: '117436', name: 'Margolly Estate 150 G', price: 495, photo: 'A117436.png' },
               { sku: '117262', name: 'Kenya 150 G', price: 650, photo: 'A117262.png' },
               { sku: '101539', name: 'Via Columbia Ready Brew', price: 530, photo: 'W101539.png' },
               { sku: '100744', name: 'Via Italian Ready Brew', price: 530, photo: 'W100744.png' },
            ],
         },
      ],
   },
   {
      key: 'merchandise',
      name: 'Merchandise',
      tab: true,
      subCategories: [
         {
            name: 'Bearista Cup',
            items: [
               { sku: '118408', name: 'Pink Glass Bearista Cold Cup 591ml', price: 4250, photo: '118408.jpg' },
               { sku: '118407', name: 'Football Glass Bearista Cold Cup 591 ml', price: 4250, photo: 'M118407.jpg' },
            ],
         },
         {
            name: 'Back to Campus',
            items: [
               { sku: '118192', name: 'Cup Daily Planner', price: 550, photo: '118192.jpg' },
               { sku: '118212', name: 'Black Rollerball Pen', price: 390, photo: '118212.jpg' },
               { sku: '118194', name: 'Magnetic Bookmarks (Set of 3)', price: 250, photo: '118194.jpg' },
               { sku: '118191', name: 'Bearista Hardbound Diary', price: 495, photo: '118191.jpg' },
               { sku: '118188', name: 'Pocket Notebooks (Set of 3)', price: 330, photo: '118188.jpg' },
               { sku: '118213', name: 'Small Stationary Pouch', price: 390, photo: '118213.jpg' },
               { sku: '118193', name: 'Sticker Sheets (Set of 3)', price: 150, photo: '118193.jpg' },
               { sku: '118211', name: 'Green Rollerball Pen', price: 390, photo: '118211.jpg' },
               { sku: '118189', name: 'Wiro Journal', price: 495, photo: '118189.jpg' },
               { sku: '118190', name: 'Cup Hardbound Diary', price: 495, photo: '118190.jpg' },
            ],
         },
         {
            name: 'Summer Drinkware',
            items: [
               { sku: '118162', name: 'Summer Wave SS Tumbler 340ml', price: 1650, photo: '118162.jpg' },
               { sku: '118163', name: 'Summer Resort WTBL 500ml', price: 1750, photo: '118163.jpg' },
               { sku: '117951', name: 'Summer Resort PL Cold Cup 591ml', price: 2350, photo: '117951.jpg' },
               { sku: '117952', name: 'Summer Wave PL Cold Cup 710ml', price: 2750, photo: '117952.jpg' },
            ],
         },
         {
            name: 'Water Bottles',
            items: [
               { sku: '117798', name: 'Starbucks Matte Black Bottle with Magnetic lid 739ml', price: 1950, photo: '117798.png' },
               { sku: '116389', name: 'WTBL SS Gradient Mint Siren 500 ml', price: 1200, tags: ['popular'], photo: '116389.png' },
               { sku: '115931', name: 'WTBL SS Green Wordmark 750 ml', price: 1200, photo: '115931.jpg' },
            ],
         },
         {
            name: 'Mugs',
            items: [
               { sku: '118085', name: 'Cuddle Koala Ceramic Mug 414ml', price: 2450, photo: '118085.jpg' },
               { sku: '117796', name: 'Pink and Blue Mug 414ml', price: 850, photo: '117796.png' },
               { sku: '116600', name: 'MUG AHMEDABAD BTS 414ML', price: 680, photo: '116600.png' },
               { sku: '115557', name: 'Mug 14 Oz Wordmark In', price: 735, photo: '115557.jpg' },
               { sku: '118086', name: 'Koala Napper PL Cold Cup 710ml', price: 2700, photo: '118086.jpg' },
               { sku: '116599', name: 'MUG CHENNAI BTS 414ML', price: 680, photo: '116599.png' },
               { sku: '118087', name: 'Sloth Sleepy PL Cold Cup 473ml', price: 2700, photo: '118087.jpg' },
               { sku: '118088', name: 'Coastal PL Cold Cup 710ml', price: 1800, photo: '118088.jpg' },
               { sku: '118089', name: 'Rainbow PL Cold Cup 710ml', price: 3050, photo: '118089.jpg' },
               { sku: '109711', name: 'Bengaluru Been There Ceramic Cup (414 Ml)', price: 208.68, photo: '109711.jpg' },
            ],
         },
         {
            name: 'Accessories',
            items: [{ sku: '117079', name: 'Bearista Keychain New MRP', price: 370, photo: '117079.png' }],
         },
      ],
   },
   {
      /**
       * Chip-only: the site gives Ready to Eat no tab, so these four packaged
       * snacks are reachable from nowhere else in the menu. They are the only
       * products in the catalogue that are not also under one of the four tabs.
       */
      key: 'ready-to-eat',
      name: 'Ready to Eat',
      tab: false,
      subCategories: [
         {
            name: 'Quick Bites',
            items: [
               { sku: '116883', name: 'Roasted & Salted Cashew 50 gms', price: 190, kcal: 152, serve: '25 g', veg: true, photo: '116883.png' },
               { sku: '116810', name: 'Salted Almond Chocolate Bites -50Gm', price: 195, kcal: 146, serve: '25 g', veg: true, photo: '116810.png' },
               { sku: '116807', name: 'Almond Biscotti - 50g', price: 180, kcal: 102, serve: '25 g', veg: false, photo: '116807.png' },
               { sku: '116882', name: 'Roasted & Salted Almond 50 gms', price: 190, kcal: 158, serve: '25 g', veg: true, photo: '116882.png' },
            ],
         },
      ],
   },
];

/**
 * The three chips that are views rather than categories, as the SKU lists the
 * site serves. Every SKU resolves against `MENU` — these curate, they never
 * introduce a product, which is why they are ids and not copies.
 *
 * `New Launch` is the only one the site sub-divides by tab; the grouping is kept
 * because the chip renders those four headings.
 */
export const CURATED: Record<string, readonly string[]> = {
   'New Launch: Drinks': ['118468', '118458', '118457', '118489', '118463', '118464', '118460', '117064', '118132', '118504', '118472'],
   'New Launch: Food': ['118577', '118429', '118428', '118427', '118572', '118576', '108177'],
   'New Launch: At Home Coffee': ['118422'],
   'New Launch: Merchandise': ['118408', '118085', '118088', '118089', '118087', '118086'],
   'Best Seller': ['100419', '103515', '100433', '100501', '105468'],
   'Power Picks: Drinks': ['117864', '115790', '118285', '103477', '118292', '117858', '117855', '116732', '117861', '116799', '117868', '100433', '100377', '100419'],
   'Power Picks: Food': ['116873', '104362'],
};

/** Flat lookup by SKU — built once, since `CURATED` resolves through it. */
export const ITEMS_BY_SKU: ReadonlyMap<string, MenuItem> = new Map(
   MENU.flatMap((c) => c.subCategories.flatMap((s) => s.items)).map((i) => [i.sku, i]),
);
