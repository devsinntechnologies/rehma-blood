"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMapOverview,
  setCurrentLocation,
  setGeolocationError,
  setBloodGroupFilter,
  setRadiusFilter,
  selectMapDonors,
  selectMapRequests,
  selectMapCurrentLocation,
  selectMapFilters,
  selectMapStatus,
  selectMapError,
  selectGeolocationError,
} from "@/store/mapSlice";

export function useMapOverview() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const donors = useAppSelector(selectMapDonors);
  const requests = useAppSelector(selectMapRequests);
  const currentLocation = useAppSelector(selectMapCurrentLocation);
  const filters = useAppSelector(selectMapFilters);
  const status = useAppSelector(selectMapStatus);
  const error = useAppSelector(selectMapError);
  const geolocationError = useAppSelector(selectGeolocationError);

  // Request geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      dispatch(setGeolocationError("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(
          setCurrentLocation({
            latitude,
            longitude,
          })
        );
      },
      (error) => {
        let errorMessage = "Failed to get your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Permission denied. Please enable location access.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out.";
        }
        dispatch(setGeolocationError(errorMessage));
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  }, [dispatch]);

  // Fetch map overview when location or filters change
  useEffect(() => {
    if (
      !auth.accessToken ||
      currentLocation.latitude === null ||
      currentLocation.longitude === null
    ) {
      return;
    }

    // Only fetch if in idle state or if we have new filters/location
    if (status === "idle" || status === "succeeded" || status === "failed") {
      dispatch(
        fetchMapOverview({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          bloodGroup: filters.bloodGroup,
          radiusKm: filters.radiusKm,
        })
      );
    }
  }, [
    dispatch,
    auth.accessToken,
    currentLocation.latitude,
    currentLocation.longitude,
    filters.bloodGroup,
    filters.radiusKm,
    status,
  ]);

  return {
    donors,
    requests,
    currentLocation,
    filters,
    status,
    error,
    geolocationError,
    setBloodGroupFilter: (bloodGroup: string | null) =>
      dispatch(setBloodGroupFilter(bloodGroup)),
    setRadiusFilter: (radiusKm: number | null) =>
      dispatch(setRadiusFilter(radiusKm)),
  };
}
