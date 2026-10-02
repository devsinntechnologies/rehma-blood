"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  centerOnAdmin,
  fetchMapOverview,
  resetToAllAreas,
  setBloodGroupFilter,
  setGeolocationError,
  setLayerFilter,
  setRadiusFilter,
  type MapLayer,
} from "@/store/mapSlice";

/** Owns the Live Map data. Call it once per page and pass the result down. */
export function useMapOverview() {
  const dispatch = useAppDispatch();
  const hasToken = useAppSelector((state) => Boolean(state.auth.accessToken));
  const map = useAppSelector((state) => state.map);
  const { center, filters } = map;

  // Refetch only when the query inputs change — never in response to our own status updates.
  useEffect(() => {
    if (hasToken) {
      dispatch(fetchMapOverview());
    }
  }, [dispatch, hasToken, center.latitude, center.longitude, filters.bloodGroup, filters.radiusKm]);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      dispatch(setGeolocationError("Location isn't supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => dispatch(centerOnAdmin({ latitude: coords.latitude, longitude: coords.longitude })),
      (error) =>
        dispatch(
          setGeolocationError(
            error.code === error.PERMISSION_DENIED
              ? "Location permission was denied. Showing all areas instead."
              : "Couldn't get your location. Showing all areas instead."
          )
        ),
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [dispatch]);

  return {
    ...map,
    refresh: () => dispatch(fetchMapOverview()),
    setBloodGroup: (bloodGroup: string | null) => dispatch(setBloodGroupFilter(bloodGroup)),
    setRadius: (radiusKm: number) => dispatch(setRadiusFilter(radiusKm)),
    setLayer: (layer: MapLayer) => dispatch(setLayerFilter(layer)),
    locateMe,
    showAllAreas: () => dispatch(resetToAllAreas()),
    dismissGeolocationError: () => dispatch(setGeolocationError(null)),
  };
}

export type MapOverview = ReturnType<typeof useMapOverview>;
