'use client';

import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import VerifiedIcon from '@mui/icons-material/Verified';
import ReplyIcon from '@mui/icons-material/Reply';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';
import { GlassAvatar } from './GlassAvatar';
import { RatingStars } from './RatingStars';

interface ReviewReply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isStore?: boolean;
}

interface ReviewCardProps {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  createdAt: string;
  helpfulCount?: number;
  notHelpfulCount?: number;
  isVerifiedPurchase?: boolean;
  reply?: ReviewReply;
  onHelpful?: (id: string) => void;
  onNotHelpful?: (id: string) => void;
  onReply?: (id: string) => void;
}

export function ReviewCard({
  id,
  author,
  avatar,
  rating,
  title,
  content,
  images,
  createdAt,
  helpfulCount = 0,
  notHelpfulCount = 0,
  isVerifiedPurchase = false,
  reply,
  onHelpful,
  onNotHelpful,
  onReply,
}: ReviewCardProps) {
  const isDark = useIsDarkMode();
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isContentLong = content.length > 300;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        ...createGlassStyles('default', isDark),
        borderRadius: '16px',
        p: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <GlassAvatar src={avatar} alt={author} size="medium">
          {author.charAt(0)}
        </GlassAvatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {author}
            </Typography>
            {isVerifiedPurchase && (
              <Tooltip title="Verified Purchase">
                <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
              </Tooltip>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RatingStars value={rating} size="small" />
            <Typography variant="caption" color="text.secondary">
              {formatDate(createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Title */}
      {title && (
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>
      )}

      {/* Content */}
      <Collapse in={showFullContent || !isContentLong} collapsedSize={80}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {content}
        </Typography>
      </Collapse>
      {isContentLong && (
        <Box
          component={motion.button}
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowFullContent(!showFullContent)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 1,
            border: 'none',
            background: 'none',
            color: 'primary.main',
            cursor: 'pointer',
            padding: 0,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {showFullContent ? 'Show less' : 'Read more'}
          <ExpandMoreIcon
            sx={{
              transform: showFullContent ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s',
              fontSize: 18,
            }}
          />
        </Box>
      )}

      {/* Images */}
      {images && images.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {images.map((image, index) => (
            <Box
              key={index}
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImage(image)}
              sx={{
                width: 60,
                height: 60,
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              }}
            >
              <img
                src={image}
                alt={`Review image ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, pt: 2, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}` }}>
        <Typography variant="caption" color="text.secondary">
          Was this helpful?
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => onHelpful?.(id)}
            sx={{ color: 'text.secondary' }}
          >
            <ThumbUpIcon fontSize="small" />
          </IconButton>
          {helpfulCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              {helpfulCount}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => onNotHelpful?.(id)}
            sx={{ color: 'text.secondary' }}
          >
            <ThumbDownIcon fontSize="small" />
          </IconButton>
          {notHelpfulCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              {notHelpfulCount}
            </Typography>
          )}
        </Box>
        {onReply && (
          <IconButton
            size="small"
            onClick={() => onReply(id)}
            sx={{ ml: 'auto', color: 'text.secondary' }}
          >
            <ReplyIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Store Reply */}
      {reply && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: isDark ? 'rgba(100, 181, 246, 0.1)' : 'rgba(33, 150, 243, 0.08)',
            borderRadius: '12px',
            borderLeft: `3px solid`,
            borderLeftColor: 'primary.main',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {reply.author}
            </Typography>
            {reply.isStore && (
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.25,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                Store
              </Typography>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {reply.content}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {formatDate(reply.createdAt)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ReviewCard;
