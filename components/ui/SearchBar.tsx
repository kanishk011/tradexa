'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Divider,
  ClickAwayListener,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HistoryIcon from '@mui/icons-material/History';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  type: 'product' | 'category' | 'brand';
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
  suggestions?: SearchResult[];
  recentSearches?: string[];
  trendingSearches?: string[];
  loading?: boolean;
}

export function SearchBar({
  placeholder = 'Search products...',
  onSearch,
  onResultClick,
  suggestions = [],
  recentSearches = [],
  trendingSearches = [],
  loading = false,
}: SearchBarProps) {
  const isDark = useIsDarkMode();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showDropdown = isFocused && (query.length > 0 || recentSearches.length > 0 || trendingSearches.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    setIsFocused(false);
    setQuery('');
  };

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    onSearch?.(searchTerm);
    setIsFocused(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsFocused(false)}>
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            ...createGlassStyles('default', isDark),
            borderRadius: '16px',
            padding: '4px 8px',
            transition: 'all 0.3s ease',
            ...(isFocused && {
              ...createGlassStyles('elevated', isDark),
            }),
          }}
        >
          <IconButton type="submit" sx={{ p: 1 }}>
            <SearchIcon color="action" />
          </IconButton>
          <InputBase
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            sx={{
              flex: 1,
              ml: 1,
              '& input': {
                padding: '8px 0',
              },
            }}
          />
          <AnimatePresence>
            {query && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <IconButton onClick={handleClear} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                zIndex: 1000,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  ...createGlassStyles('elevated', isDark),
                  borderRadius: '16px',
                  maxHeight: 400,
                  overflow: 'auto',
                }}
              >
                {/* Search Results */}
                {query.length > 0 && suggestions.length > 0 && (
                  <>
                    <Typography
                      variant="overline"
                      sx={{ px: 2, pt: 2, display: 'block', color: 'text.secondary' }}
                    >
                      Results
                    </Typography>
                    <List dense>
                      {suggestions.map((result) => (
                        <ListItem
                          key={result.id}
                          component={motion.li}
                          whileHover={{ x: 4 }}
                          onClick={() => handleResultClick(result)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: isDark
                                ? 'rgba(255,255,255,0.05)'
                                : 'rgba(0,0,0,0.03)',
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={result.image}
                              variant="rounded"
                              sx={{ width: 48, height: 48 }}
                            >
                              {result.title.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={result.title}
                            secondary={result.subtitle}
                          />
                          <Chip
                            label={result.type}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {/* Recent Searches */}
                {query.length === 0 && recentSearches.length > 0 && (
                  <>
                    <Typography
                      variant="overline"
                      sx={{ px: 2, pt: 2, display: 'block', color: 'text.secondary' }}
                    >
                      <HistoryIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                      Recent Searches
                    </Typography>
                    <Box sx={{ px: 2, pb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {recentSearches.map((search, index) => (
                        <Chip
                          key={index}
                          label={search}
                          size="small"
                          onClick={() => handleQuickSearch(search)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                    <Divider sx={{ my: 1 }} />
                  </>
                )}

                {/* Trending Searches */}
                {query.length === 0 && trendingSearches.length > 0 && (
                  <>
                    <Typography
                      variant="overline"
                      sx={{ px: 2, pt: 1, display: 'block', color: 'text.secondary' }}
                    >
                      <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                      Trending
                    </Typography>
                    <Box sx={{ px: 2, pb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {trendingSearches.map((search, index) => (
                        <Chip
                          key={index}
                          label={search}
                          size="small"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleQuickSearch(search)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </>
                )}

                {/* No Results */}
                {query.length > 0 && suggestions.length === 0 && !loading && (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No results found for "{query}"
                    </Typography>
                  </Box>
                )}

                {/* Loading */}
                {loading && (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">Searching...</Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </ClickAwayListener>
  );
}

export default SearchBar;
