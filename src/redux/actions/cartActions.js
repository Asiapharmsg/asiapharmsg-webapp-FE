export const ADD_TO_CART = 'ADD_TO_CART';
export const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
export const DELETE_FROM_CART = 'DELETE_FROM_CART';
export const DELETE_ALL_FROM_CART = 'DELETE_ALL_FROM_CART';
export const INPUT_QUANTITY = 'INPUT_QUANTITY';
//add to cart
export const addToCart = (
  item,
  addToast,
  quantityCount,
  selectedProductColor,
  selectedProductSize
) => {
  return (dispatch) => {
    if (addToast) {
      addToast('Added To Cart', { appearance: 'success', autoDismiss: true });
    }
    dispatch({
      type: ADD_TO_CART,
      payload: {
        ...item,
        quantity: quantityCount,
        selectedProductColor: selectedProductColor
          ? selectedProductColor
          : item.selectedProductColor
          ? item.selectedProductColor
          : null,
        selectedProductSize: selectedProductSize
          ? selectedProductSize
          : item.selectedProductSize
          ? item.selectedProductSize
          : null
      }
    });
  };
};
//decrease from cart
export const decreaseQuantity = (item, addToast) => {
  return (dispatch) => {
    if (addToast) {
      addToast('Item Decremented From Cart', {
        appearance: 'warning',
        autoDismiss: true
      });
    }
    dispatch({ type: DECREASE_QUANTITY, payload: item });
  };
};
//delete from cart
export const deleteFromCart = (item, addToast) => {
  return (dispatch) => {
    /*if (addToast) {
      addToast("Removed From Cart", { appearance: "error", autoDismiss: true });
    }*/
    dispatch({ type: DELETE_FROM_CART, payload: item });
  };
};
//delete all from cart
export const deleteAllFromCart = (addToast) => {
  console.log('delete all from cart - dispatch');
  return (dispatch) => {
    if (addToast) {
      console.log('delete all from cart : here1');
      addToast('Removed All From Cart', {
        appearance: 'error',
        autoDismiss: true
      });
    }
    dispatch({ type: DELETE_ALL_FROM_CART });
  };
};

// get stock of cart item
export const cartItemStock = (item, color, size) => {
  if (item.stock) {
    return item.stock;
  } else {
    return item.variation
      .filter((single) => single.color === color)[0]
      .size.filter((single) => single.name === size)[0].stock;
  }
};

//increase from cart
export const increaseQuantity = (item, addToast) => {
  return (dispatch) => {
    if (addToast) {
      addToast('Item Incremented From Cart', {
        appearance: 'warning',
        autoDismiss: true
      });
    }
    dispatch({ type: INCREASE_QUANTITY, payload: item });
  };
};
//input quantity from cart
export const inputQuantity = (item, addToast) => {
  return (dispatch) => {
    if (addToast) {
      addToast("Typed item's quantity From Cart", {
        appearance: 'warning',
        autoDismiss: true
      });
    }
    dispatch({ type: INPUT_QUANTITY, payload: item });
  };
};
