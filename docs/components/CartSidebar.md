# CartSidebar

## Add to cart functionality

The vue component attaches events listeners to the html elements that exists on page load (not to the elements added later to DOM) and have **vue-add-to-cart** class.
The elements that should add cart items must have **data-product-json** attribute defined, and may also have **data-promocode** and **data-locked-cart** attributes.

The **data-product-json** attribute may contain one or more product sku as key and quantity as value. Example:

```
data-product-json='{"stick-bag": 1}'
```

```
data-product-json='{"stick-bag": 2, "quietpad": 3, "the-drummers-toolbox-book": 1}'
```

The **data-promocode** may contain a string.
```
data-promocode="Aj532fG1"
```

The **data-locked-cart** may contain a boolean, if not defined it is considered as **false**.
```
data-locked-cart="true"
```

Html markup example:
```html
<a href="#" class="vue-add-to-cart" data-product-json='{"stick-bag": 1}'></a>
```

For products with variants or bundles, use either **selected-pack** or **merch** class to *enable existance check* of **active** class.

Example of product that will be added to cart if clicked:
```html
<a href="#" class="vue-add-to-cart merch active" data-product-json='{"stick-bag": 1}'></a>
```

Example of product that fails **active** class existance check and will **not** be added to cart if clicked:
```html
<a href="#" class="vue-add-to-cart merch" data-product-json='{"stick-bag": 1}'></a>
```

The click event listener is attached to all elements with **vue-add-to-cart** class and the check for the classes **selected-pack**, **merch** and **active** existance is performed when the event is emited (the **selected-pack**, **merch** and **active** may be added/removed after the event listener is attached).


## Disable cart sidebar functionality

For any html element that triggers unwanted *cart sidebar / add to cart* functionality, remove the **vue-add-to-cart** css class.


## Setup

### JS assets compilation

Setup a vue application in web project (example drumeo resources/assets/members/js/cart-sidebar.js):

```js
import Vue from 'vue';
import CartSidebar from 'vuesora/src/components/CartSidebar';
import NavCartButton from 'vuesora/src/components/NavCartButton';

Vue.use(CartSidebar);
Vue.use(NavCartButton);
```

Setup webpack mix (also needs plugins to parse vue components):

```js
mix.js(
    path.join(__dirname, 'resources/assets/members/js/cart-sidebar.js'),
    path.join(__dirname, 'public/js')
);
```

Run webpack assets compilation command.

### JS assets loading
In the blade template layout load the JS assets:

```html
<script src="{{ _mix('js/manifest.js') }}"></script>
<script src="{{ _mix('js/vendor.js') }}"></script>
<script src="{{ _mix('js/cart-sidebar.js') }}"></script>
<script src="{{ _mix('js/app.js') }}"></script>
```

## Component usage

Component may be placed in any location in body section. The only requirement is to be wrapped in vue app element. Currently the component is used next to NavCartButton component, in navigation blade template.

Note: The vue application will remove any existing JS event listeners attached to elements contained in vue app element.

### Props

| Prop       | Type     | Default      | Description
|------------|----------|--------------|---------------
| `brand`    | String   | 'drumeo'     | The current applications brand name
| `cartData` | String   | N/A          | Required, no existing default. Current cart structure, serialized with ecommerce ResponseService.

### Existing cart data serialization

Data sent to the view that uses CartSidebar component (example drumeo app/Http/ViewComposers/SalesNavComposer.php)

```php
$cartArray = $this->cartService->toArray();
$cartJson = ResponseService::cart($cartArray)
    ->respond()
    ->getContent();

$view->with(['cartData' => $cartJson]);
```

### Component markup

The current serialized cart structure may contain double quotes, so it needs to wrapped in single quotes:
(example drumeo resources/views/sales/_nav.blade.php)


```html
<div id="app">
    <nav-cart-button
        cart-data='{{ $cartData }}'
    ></nav-cart-button>
    <cart-sidebar
        brand="drumeo"
        cart-data='{{ $cartData }}'
    ></cart-sidebar>
</div>
```

