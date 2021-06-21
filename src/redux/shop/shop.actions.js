import { ShopActionTypes } from "./shop.types";

import {
  firestore,
  convertCollectionsSnapshotToMap,
} from "../../firebase/firebase.utils";

export const fetchCollectionsStart = () => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_START,
});

export const fetchCollectionsSuccess = (collectionsMap) => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_SUCCESS,
  payload: collectionsMap,
});

export const fetchCollectionsFailure = (err) => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_FAILURE,
  payload: err,
});

export const fetchCollectionsStartAsync = () => {
  return (dispatch) => {
    const collectionRef = firestore.collection("collections");
    dispatch(fetchCollectionsStart());

    collectionRef
      .get()
      .then((snapshot) => {
        const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
        // this.props.updateCollections(collectionsMap);
        dispatch(fetchCollectionsSuccess(collectionsMap));
      })
      .catch((err) => dispatch(fetchCollectionsFailure(err.message)));
  };
};
