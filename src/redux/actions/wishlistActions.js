import axios from 'axios';

export const NEW_WISHLIST = 'NEW_WISHLIST';
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const DELETE_FROM_WISHLIST = 'DELETE_FROM_WISHLIST';
export const DELETE_ALL_FROM_WISHLIST = 'DELETE_ALL_FROM_WISHLIST';

export const newWishlist = (data) => {
  return (dispatch) => {
    dispatch({ type: NEW_WISHLIST, payload: data });
  };
};

// add to wishlist
export const addToWishlist = (item, addToast) => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    axios
      .post(
        `${process.env.API_URL}/api/products/wishlist`,
        {
          product_id: item.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((resp) => {
        if (resp.status === 200) {
          if (addToast) {
            addToast('Added To Wishlist', {
              appearance: 'success',
              autoDismiss: true
            });
          }
          dispatch({ type: ADD_TO_WISHLIST, payload: item });
        }
      })
      .catch((err) => {
        console.log(err);
        if (addToast) {
          addToast('Error while adding to wishlist', {
            appearance: 'error',
            autoDismiss: true
          });
        }
      });
  };
};

// delete from wishlist
export const deleteFromWishlist = (item, addToast) => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    axios
      .delete(`${process.env.API_URL}/api/products/wishlist/${item.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((resp) => {
        if (resp.status === 200) {
          if (addToast) {
            addToast('Removed from wishlist', {
              appearance: 'success',
              autoDismiss: true
            });
          }
          dispatch({ type: DELETE_FROM_WISHLIST, payload: item });
        }
      })
      .catch((err) => {
        console.log(err);
        if (addToast) {
          addToast('Error while removing from wishlist', {
            appearance: 'error',
            autoDismiss: true
          });
        }
      });
  };
};

//delete all from wishlist
export const deleteAllFromWishlist = (addToast) => {
  return (dispatch) => {
    if (addToast) {
      addToast('Removed All From Wishlist', {
        appearance: 'error',
        autoDismiss: true
      });
    }
    dispatch({ type: DELETE_ALL_FROM_WISHLIST });
  };
};
