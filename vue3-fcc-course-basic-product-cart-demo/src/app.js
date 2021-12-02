let app = Vue.createApp({
    data() {
      return {
        // inventory: {
        //   carrots: 0,
        //   pineapples: 0,
        //   cherries: 0
        // },
        inventory: [],
        // cart: {
        //   carrots: 0,
        //   pineapples: 0,
        //   cherries: 0
        // },
        cart:{},
        isSideBarCartVisible: false,
        totalCartItemType:0,
      }
    },
    computed:{
      cartItemCount:{
        get() {
          return Object.values(this.cart).reduce((acc,curr,index) => {
            return acc + curr
          }, 0)
        }
      }
    },
    methods: {
      addToCart(name, idx) {
        if( !this.cart[name] ) this.cart[name] = 0
        this.cart[name] += this.inventory[idx].quantity
        this.inventory[idx].quantity = 0
        console.log(this.cart)
      },
      toggleSideBarCart(){
        this.isSideBarCartVisible = !this.isSideBarCartVisible
      },
      removeCartItem(name) {
        delete this.cart[name]
      }
    },
    async mounted(){
      let res = await fetch('./food.json');
      const foodData = await res.json();
      this.inventory = foodData;
    }
  })

  app.component('cart-sidebar-component',{
    props:['toggle', 'cart', 'inventory', 'remove'], // don't use camelCase for propsname 
    computed:{
      // cartTotal(){
      //   return cart.carrots * 4.82; 
      // }

      // cartTotal:{
      //   get(){
      //     return (this.cart.carrots * 4.82).toFixed(2)
      //   },
      //   set(value){

      //   }
      // }
    },
    methods:{
      getPrice(name){
        const productName = this.inventory.find((p) => {
          return p.name === name
        })

        return productName.price.USD
      },
      calculateCartTotal() {
        // const names = Object.keys(this.cart)
        // const total = Object.values(this.cart).reduce((previousValue, currentValue, currentIndex) => { 
        //   return previousValue + ( currentValue * this.getPrice(names[currentIndex]))
        //  })
        const total = Object.entries(this.cart).reduce((acc, current, index) => {
          return acc + ( current[1] * this.getPrice(current[0]))
        }, 0)
        return total.toFixed(2)
      }
    },
    template:
    `
    <aside class="cart-container">
    <div class="cart">
      <h1 class="cart-title spread">
        <span>
          Cart
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggle" class="cart-close" >&times;</button>
      </h1>

      <div class="cart-body">
        <table class="cart-table">
          <thead>
            <tr>
              <th><span class="sr-only">Product Image</span></th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quantity, key, idx) in cart" :key="idx">
              <td><i class="icofont-carrot icofont-3x"></i></td>
              <td>{{ key }}</td>
              <td>$\{{ getPrice(key) }}</td>
              <td class="center">{{ quantity }}</td>
              <td>$\{{ (quantity * getPrice(key)).toFixed(2)}}</td>
              <td class="center">
                <button class="btn btn-light cart-remove" @click="remove(key)">
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
        <div class="spread">
          <span><strong>Total:</strong> $\{{calculateCartTotal()}}</span>
          <button class="btn btn-light">Checkout</button>
        </div>
      </div>
    </div>
  </aside>
    `,
  })
  app.mount('#app')