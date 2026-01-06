'use client';

import React from 'react';
import { Box, Typography, Chip, Divider, Avatar, AvatarGroup } from '@mui/material';
import { motion } from 'framer-motion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useIsDarkMode } from '@/lib/theme';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface OrderCardProps {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;
  deliveredAt?: string;
  trackingNumber?: string;
  onViewDetails?: (id: string) => void;
  onTrackOrder?: (id: string) => void;
  onReorder?: (id: string) => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'warning', icon: <PendingIcon /> },
  confirmed: { label: 'Confirmed', color: 'info', icon: <AccessTimeIcon /> },
  processing: { label: 'Processing', color: 'primary', icon: <AccessTimeIcon /> },
  shipped: { label: 'Shipped', color: 'info', icon: <LocalShippingIcon /> },
  delivered: { label: 'Delivered', color: 'success', icon: <CheckCircleIcon /> },
  cancelled: { label: 'Cancelled', color: 'error', icon: <CancelIcon /> },
};

export function OrderCard({
  id,
  orderNumber,
  status,
  items,
  total,
  createdAt,
  deliveredAt,
  trackingNumber,
  onViewDetails,
  onTrackOrder,
  onReorder,
}: OrderCardProps) {
  const isDark = useIsDarkMode();
  const statusInfo = statusConfig[status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <GlassCard sx={{ p: 0 }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Order #{orderNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Placed on {formatDate(createdAt)}
          </Typography>
        </Box>
        <Chip
          icon={statusInfo.icon as React.ReactElement}
          label={statusInfo.label}
          color={statusInfo.color}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      <Divider />

      {/* Items Preview */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <AvatarGroup max={4}>
          {items.map((item) => (
            <Avatar
              key={item.id}
              src={item.image}
              alt={item.name}
              variant="rounded"
              sx={{ width: 48, height: 48 }}
            >
              {item.name.charAt(0)}
            </Avatar>
          ))}
        </AvatarGroup>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {items.map((item) => item.name).join(', ')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {items.reduce((sum, item) => sum + item.quantity, 0)} items
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          ${total.toFixed(2)}
        </Typography>
      </Box>

      {/* Tracking Info */}
      {trackingNumber && status === 'shipped' && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 1.5, backgroundColor: isDark ? 'rgba(100, 181, 246, 0.1)' : 'rgba(33, 150, 243, 0.08)' }}>
            <Typography variant="caption" color="text.secondary">
              Tracking Number:{' '}
              <Typography component="span" variant="caption" fontWeight={600} color="primary.main">
                {trackingNumber}
              </Typography>
            </Typography>
          </Box>
        </>
      )}

      {/* Delivery Info */}
      {deliveredAt && status === 'delivered' && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 1.5, backgroundColor: isDark ? 'rgba(102, 187, 106, 0.1)' : 'rgba(76, 175, 80, 0.08)' }}>
            <Typography variant="caption" color="success.main">
              Delivered on {formatDate(deliveredAt)}
            </Typography>
          </Box>
        </>
      )}

      <Divider />

      {/* Actions */}
      <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        {onViewDetails && (
          <GlassButton
            size="small"
            onClick={() => onViewDetails(id)}
          >
            View Details
          </GlassButton>
        )}
        {onTrackOrder && status === 'shipped' && (
          <GlassButton
            size="small"
            variant="outlined"
            onClick={() => onTrackOrder(id)}
          >
            Track Order
          </GlassButton>
        )}
        {onReorder && status === 'delivered' && (
          <GlassButton
            size="small"
            variant="contained"
            onClick={() => onReorder(id)}
          >
            Reorder
          </GlassButton>
        )}
      </Box>
    </GlassCard>
  );
}

export default OrderCard;
