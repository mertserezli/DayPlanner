import React, { useEffect, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export default function SwipeableViews({
  index = 0,
  onChangeIndex,
  children,
  sx,
  style,
  ...props
}) {
  const containerRef = useRef(null);
  const isProgrammaticScroll = useRef(false);
  const isFirstRender = useRef(true);
  const lastEmittedIndex = useRef(index);
  const scrollTimeoutRef = useRef(null);

  // Sync scroll position when index changes externally (e.g. user tapped a tab)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !container.clientWidth) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastEmittedIndex.current = index;
      container.scrollTo({
        left: index * container.clientWidth,
        behavior: 'auto',
      });
      return;
    }

    // If the index update was already triggered by user's swipe, don't interrupt native touch scroll
    if (index === lastEmittedIndex.current) {
      return;
    }

    lastEmittedIndex.current = index;
    isProgrammaticScroll.current = true;
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: 'smooth',
    });
  }, [index]);

  // Keep alignment when window resizes
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container || !container.clientWidth) return;
      lastEmittedIndex.current = index;
      container.scrollTo({
        left: index * container.clientWidth,
        behavior: 'auto',
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [index]);

  const onScrollEnd = useCallback(() => {
    isProgrammaticScroll.current = false;
    const container = containerRef.current;
    if (!container || !container.clientWidth) return;

    const slideWidth = container.clientWidth;
    const finalIndex = Math.round(container.scrollLeft / slideWidth);
    const childCount = React.Children.count(children);

    if (
      finalIndex !== lastEmittedIndex.current &&
      finalIndex >= 0 &&
      finalIndex < childCount &&
      typeof onChangeIndex === 'function'
    ) {
      lastEmittedIndex.current = finalIndex;
      onChangeIndex(finalIndex);
    }
  }, [children, onChangeIndex]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !container.clientWidth) return;

    // During programmatic scrolling (e.g., user clicked a tab), ignore intermediate scroll events
    if (isProgrammaticScroll.current) {
      const targetLeft = index * container.clientWidth;
      if (Math.abs(container.scrollLeft - targetLeft) <= 5) {
        isProgrammaticScroll.current = false;
      }
      return;
    }

    // User is actively swiping: immediately update the active tab as soon as the slide passes midpoint
    const slideWidth = container.clientWidth;
    const computedIndex = Math.round(container.scrollLeft / slideWidth);
    const childCount = React.Children.count(children);

    if (
      computedIndex !== lastEmittedIndex.current &&
      computedIndex >= 0 &&
      computedIndex < childCount &&
      typeof onChangeIndex === 'function'
    ) {
      lastEmittedIndex.current = computedIndex;
      onChangeIndex(computedIndex);
    }

    // Debounce fallback to ensure scroll settle/accuracy
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(onScrollEnd, 100);
  }, [index, children, onChangeIndex, onScrollEnd]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scrollend', onScrollEnd);
    return () => {
      container.removeEventListener('scrollend', onScrollEnd);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [onScrollEnd]);

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        width: '100%',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        ...sx,
      }}
      style={style}
      {...props}
    >
      {React.Children.map(children, (child) => (
        <Box
          sx={{
            flex: '0 0 100%',
            minWidth: '100%',
            maxWidth: '100%',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            boxSizing: 'border-box',
          }}
        >
          {child}
        </Box>
      ))}
    </Box>
  );
}

SwipeableViews.propTypes = {
  index: PropTypes.number,
  onChangeIndex: PropTypes.func,
  children: PropTypes.node,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
  style: PropTypes.object,
};
