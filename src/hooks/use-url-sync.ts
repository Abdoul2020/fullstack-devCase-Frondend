"use client";

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { 
  setPagination, 
  setFilters, 
  setSorting,
  selectPagination,
  selectFilters,
  selectSorting,
} from '@/lib/store/slices/usersSlice';
import { UserFilters } from '@/lib/types/users';

export function useUrlSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isInitialized = useRef(false);
  
  const pagination = useAppSelector(selectPagination);
  const filters = useAppSelector(selectFilters);
  const sorting = useAppSelector(selectSorting);

  // Parse URL parameters on mount and sync with Redux (only once)
  useEffect(() => {
    if (isInitialized.current) return;
    
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sortBy = searchParams.get('sortBy') || '';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';
    const search = searchParams.get('search') || '';
    const userType = searchParams.get('userType') || '';
    const isActiveParam = searchParams.get('isActive');
    const isActive = isActiveParam ? isActiveParam === 'true' : undefined;

    // Debug: Log all URL parameters to identify the issue
    console.log('🔍 All URL parameters:', {
      search,
      userType,
      isActiveParam,
      allParams: Object.fromEntries(searchParams.entries())
    });

    // Update Redux state from URL
    dispatch(setPagination({ page, limit }));
    
    if (sortBy) {
      dispatch(setSorting({ field: sortBy, direction: sortOrder }));
    }

    const urlFilters: UserFilters = {};
    // Only set search if it's a meaningful value (not single characters or empty)
    if (search && search.length > 1) urlFilters.search = search;
    if (userType && userType !== 'all') urlFilters.userType = userType;
    if (isActive !== undefined) urlFilters.isActive = isActive;
    
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
    }
    
    isInitialized.current = true;
  }, [searchParams, dispatch]);

  // Update URL when Redux state changes (memoized to prevent loops)
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    // Update page
    if (pagination.page !== 1) {
      params.set('page', pagination.page.toString());
    }
    
    if (pagination.limit !== 20) {
      params.set('limit', pagination.limit.toString());
    }

    // Update sorting
    if (sorting) {
      params.set('sortBy', sorting.field);
      params.set('sortOrder', sorting.direction);
    }

    // Update filters
    if (filters.search) {
      params.set('search', filters.search);
    }
    if (filters.userType) {
      params.set('userType', filters.userType);
    }
    if (filters.isActive !== undefined) {
      params.set('isActive', filters.isActive.toString());
    }

    // Update URL without triggering a page reload
    const newURL = `${window.location.pathname}?${params.toString()}`;
    router.replace(newURL, { scroll: false });
  }, [pagination.page, pagination.limit, sorting, filters, router]);

  return { updateURL };
}
