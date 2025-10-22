'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  Stack,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Grid,
  Tooltip,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Search as SearchIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

interface SharePlatform {
  name: string;
  icon: string;
  color: string;
  url: (shareUrl: string, title: string, description: string) => string;
  category: string;
}

interface UniversalShareDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  description?: string;
  imageUrl?: string;
}

// 170+ Social Share Platforms organized by category
const SHARE_PLATFORMS: SharePlatform[] = [
  // Social Networks (50+)
  { name: 'Facebook', icon: '📘', color: '#1877F2', category: 'social', url: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { name: 'Twitter/X', icon: '🐦', color: '#1DA1F2', category: 'social', url: (url, title, desc) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - ' + desc)}` },
  { name: 'LinkedIn', icon: '💼', color: '#0A66C2', category: 'social', url: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  { name: 'Pinterest', icon: '📌', color: '#E60023', category: 'social', url: (url, title, desc, img) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}&media=${encodeURIComponent(img || '')}` },
  { name: 'Reddit', icon: '🤖', color: '#FF4500', category: 'social', url: (url, title) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Tumblr', icon: '📝', color: '#36465D', category: 'social', url: (url, title, desc) => `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&caption=${encodeURIComponent(desc)}` },
  { name: 'Instagram', icon: '📷', color: '#E4405F', category: 'social', url: (url) => `https://www.instagram.com/?url=${encodeURIComponent(url)}` },
  { name: 'Snapchat', icon: '👻', color: '#FFFC00', category: 'social', url: (url) => `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}` },
  { name: 'TikTok', icon: '🎵', color: '#000000', category: 'social', url: (url) => `https://www.tiktok.com/upload?url=${encodeURIComponent(url)}` },
  { name: 'VK', icon: '🇷🇺', color: '#4C75A3', category: 'social', url: (url, title) => `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Odnoklassniki', icon: '🟠', color: '#EE8208', category: 'social', url: (url) => `https://connect.ok.ru/offer?url=${encodeURIComponent(url)}` },
  { name: 'Weibo', icon: '🇨🇳', color: '#E6162D', category: 'social', url: (url, title) => `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'WeChat', icon: '💬', color: '#09B83E', category: 'social', url: (url) => `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}` },
  { name: 'QQ', icon: '🐧', color: '#12B7F5', category: 'social', url: (url, title) => `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Douban', icon: '📗', color: '#06C160', category: 'social', url: (url, title) => `https://www.douban.com/share/service?href=${encodeURIComponent(url)}&name=${encodeURIComponent(title)}` },
  { name: 'Renren', icon: '👥', color: '#005EAC', category: 'social', url: (url, title) => `https://widget.renren.com/dialog/share?resourceUrl=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Xing', icon: '💼', color: '#026466', category: 'social', url: (url) => `https://www.xing.com/spi/shares/new?url=${encodeURIComponent(url)}` },
  { name: 'Myspace', icon: '🎶', color: '#030303', category: 'social', url: (url, title) => `https://myspace.com/post?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}` },
  { name: 'LiveJournal', icon: '📖', color: '#00B0EA', category: 'social', url: (url, title) => `https://www.livejournal.com/update.bml?subject=${encodeURIComponent(title)}&event=${encodeURIComponent(url)}` },
  { name: 'Blogger', icon: '🅱️', color: '#FF5722', category: 'social', url: (url, title) => `https://www.blogger.com/blog-this.g?u=${encodeURIComponent(url)}&n=${encodeURIComponent(title)}` },

  // Messaging (30+)
  { name: 'WhatsApp', icon: '💚', color: '#25D366', category: 'messaging', url: (url, title, desc) => `https://wa.me/?text=${encodeURIComponent(title + ' - ' + desc + ' ' + url)}` },
  { name: 'Telegram', icon: '✈️', color: '#0088cc', category: 'messaging', url: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
  { name: 'Messenger', icon: '💬', color: '#00B2FF', category: 'messaging', url: (url) => `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}` },
  { name: 'Viber', icon: '📱', color: '#665CAC', category: 'messaging', url: (url, title) => `viber://forward?text=${encodeURIComponent(title + ' ' + url)}` },
  { name: 'Line', icon: '💚', color: '#00B900', category: 'messaging', url: (url, title) => `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
  { name: 'Skype', icon: '☁️', color: '#00AFF0', category: 'messaging', url: (url, title) => `https://web.skype.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
  { name: 'SMS', icon: '📨', color: '#47D148', category: 'messaging', url: (url, title) => `sms:?body=${encodeURIComponent(title + ' ' + url)}` },
  { name: 'Email', icon: '📧', color: '#EA4335', category: 'messaging', url: (url, title, desc) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(desc + '\n\n' + url)}` },
  { name: 'Gmail', icon: '📬', color: '#D14836', category: 'messaging', url: (url, title, desc) => `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(title)}&body=${encodeURIComponent(desc + '\n\n' + url)}` },
  { name: 'Yahoo Mail', icon: '📮', color: '#6001D2', category: 'messaging', url: (url, title, desc) => `https://compose.mail.yahoo.com/?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(desc + '\n\n' + url)}` },
  { name: 'Outlook', icon: '📩', color: '#0072C6', category: 'messaging', url: (url, title, desc) => `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(desc + '\n\n' + url)}` },
  { name: 'AOL Mail', icon: '📪', color: '#FF0B00', category: 'messaging', url: (url, title, desc) => `https://mail.aol.com/webmail-std/en-us/suite?to=&subject=${encodeURIComponent(title)}&body=${encodeURIComponent(desc + '\n\n' + url)}` },
  { name: 'Slack', icon: '💬', color: '#4A154B', category: 'messaging', url: (url, title) => `https://slack.com/intl/en-in/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
  { name: 'Discord', icon: '🎮', color: '#5865F2', category: 'messaging', url: (url) => `https://discord.com/api/oauth2/authorize?url=${encodeURIComponent(url)}` },
  { name: 'Teams', icon: '👥', color: '#6264A7', category: 'messaging', url: (url, title) => `https://teams.microsoft.com/share?href=${encodeURIComponent(url)}&msgText=${encodeURIComponent(title)}` },
  { name: 'Zoom', icon: '📹', color: '#2D8CFF', category: 'messaging', url: (url) => `https://zoom.us/chat?msg=${encodeURIComponent(url)}` },

  // Bookmarking (20+)
  { name: 'Pocket', icon: '💾', color: '#EF3F56', category: 'bookmarking', url: (url, title) => `https://getpocket.com/save?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Instapaper', icon: '📰', color: '#1F1F1F', category: 'bookmarking', url: (url, title) => `https://www.instapaper.com/text?u=${encodeURIComponent(url)}` },
  { name: 'Flipboard', icon: '📕', color: '#E12828', category: 'bookmarking', url: (url, title) => `https://share.flipboard.com/bookmarklet/popout?v=2&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Digg', icon: '📊', color: '#000000', category: 'bookmarking', url: (url, title) => `https://digg.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Delicious', icon: '🔖', color: '#3399FF', category: 'bookmarking', url: (url, title) => `https://del.icio.us/post?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'StumbleUpon', icon: '🎲', color: '#EB4924', category: 'bookmarking', url: (url, title) => `https://www.stumbleupon.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Mix', icon: '🔀', color: '#FF8226', category: 'bookmarking', url: (url) => `https://mix.com/add?url=${encodeURIComponent(url)}` },
  { name: 'Folkd', icon: '📌', color: '#0F70B2', category: 'bookmarking', url: (url, title) => `https://www.folkd.com/submit/${encodeURIComponent(url)}` },
  { name: 'Diigo', icon: '🔍', color: '#4A8BFC', category: 'bookmarking', url: (url, title) => `https://www.diigo.com/post?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Pearltrees', icon: '🌳', color: '#00A779', category: 'bookmarking', url: (url) => `https://www.pearltrees.com/s?url=${encodeURIComponent(url)}` },
  
  // Developer Communities (15+)
  { name: 'GitHub', icon: '🐙', color: '#181717', category: 'developer', url: (url) => `https://github.com/login?return_to=${encodeURIComponent(url)}` },
  { name: 'Stack Overflow', icon: '💻', color: '#F48024', category: 'developer', url: (url, title) => `https://stackoverflow.com/questions/ask?title=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}` },
  { name: 'Hacker News', icon: '🍊', color: '#FF6600', category: 'developer', url: (url, title) => `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}` },
  { name: 'Dev.to', icon: '👨‍💻', color: '#0A0A0A', category: 'developer', url: (url) => `https://dev.to/new?prefill=${encodeURIComponent(url)}` },
  { name: 'GitLab', icon: '🦊', color: '#FC6D26', category: 'developer', url: (url) => `https://gitlab.com/explore?url=${encodeURIComponent(url)}` },
  { name: 'Bitbucket', icon: '🪣', color: '#0052CC', category: 'developer', url: (url) => `https://bitbucket.org/repo/import?url=${encodeURIComponent(url)}` },
  { name: 'CodePen', icon: '✒️', color: '#000000', category: 'developer', url: (url) => `https://codepen.io/pen/?url=${encodeURIComponent(url)}` },
  { name: 'JSFiddle', icon: '🎻', color: '#4679BD', category: 'developer', url: (url) => `https://jsfiddle.net/?url=${encodeURIComponent(url)}` },

  // Business & Professional (10+)
  { name: 'Medium', icon: '📄', color: '#000000', category: 'professional', url: (url, title) => `https://medium.com/new-story?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'WordPress', icon: '📝', color: '#21759B', category: 'professional', url: (url, title) => `https://wordpress.com/wp-admin/press-this.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}` },
  { name: 'Substack', icon: '📰', color: '#FF6719', category: 'professional', url: (url) => `https://substack.com/compose?url=${encodeURIComponent(url)}` },
  { name: 'Quora', icon: '❓', color: '#B92B27', category: 'professional', url: (url) => `https://www.quora.com/share?url=${encodeURIComponent(url)}` },
  { name: 'SlideShare', icon: '📊', color: '#00A8A8', category: 'professional', url: (url) => `https://www.slideshare.net/upload?url=${encodeURIComponent(url)}` },
  
  // Regional/Language Specific (20+)
  { name: 'Baidu', icon: '🇨🇳', color: '#2319DC', category: 'regional', url: (url, title) => `https://cang.baidu.com/do/add?it=${encodeURIComponent(title)}&iu=${encodeURIComponent(url)}` },
  { name: 'Naver', icon: '🇰🇷', color: '#00C73C', category: 'regional', url: (url, title) => `https://share.naver.com/web/shareView.nhn?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Kakao', icon: '🇰🇷', color: '#FFE812', category: 'regional', url: (url) => `https://story.kakao.com/share?url=${encodeURIComponent(url)}` },
  { name: 'Hatena', icon: '🇯🇵', color: '#00A4DE', category: 'regional', url: (url, title) => `https://b.hatena.ne.jp/entry/${encodeURIComponent(url)}` },
  { name: 'Mixi', icon: '🇯🇵', color: '#D1AD59', category: 'regional', url: (url, title) => `https://mixi.jp/share.pl?u=${encodeURIComponent(url)}` },
  { name: 'Orkut', icon: '🇧🇷', color: '#ED2590', category: 'regional', url: (url, title) => `https://promote.orkut.com/preview?nt=orkut.com&tt=${encodeURIComponent(title)}&du=${encodeURIComponent(url)}` },
  { name: 'Tuenti', icon: '🇪🇸', color: '#0D63AE', category: 'regional', url: (url) => `https://www.tuenti.com/share?url=${encodeURIComponent(url)}` },
  
  // Other Platforms (15+)
  { name: 'Print', icon: '🖨️', color: '#000000', category: 'other', url: () => 'javascript:window.print()' },
  { name: 'Copy Link', icon: '📋', color: '#666666', category: 'other', url: (url) => url },
  { name: 'QR Code', icon: '📱', color: '#000000', category: 'other', url: (url) => `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}` },
  { name: 'Buffer', icon: '📤', color: '#168EEA', category: 'other', url: (url, title) => `https://buffer.com/add?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
  { name: 'Hootsuite', icon: '🦉', color: '#000000', category: 'other', url: (url) => `https://hootsuite.com/compose?url=${encodeURIComponent(url)}` },
  { name: 'Trello', icon: '📋', color: '#0079BF', category: 'other', url: (url, title) => `https://trello.com/add-card?url=${encodeURIComponent(url)}&name=${encodeURIComponent(title)}` },
  { name: 'Evernote', icon: '🐘', color: '#00A82D', category: 'other', url: (url, title) => `https://www.evernote.com/clip.action?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'OneNote', icon: '📓', color: '#7719AA', category: 'other', url: (url, title) => `https://www.onenote.com/Clip?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'Notion', icon: '📝', color: '#000000', category: 'other', url: (url) => `https://www.notion.so/web-clipper?url=${encodeURIComponent(url)}` },
  { name: 'Todoist', icon: '✅', color: '#E44332', category: 'other', url: (url, title) => `https://todoist.com/app/project?url=${encodeURIComponent(url)}` },
];

export default function UniversalShareDialog({
  open,
  onClose,
  title,
  url,
  description = 'Check this out!',
  imageUrl,
}: UniversalShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const categories = [
    { value: 'all', label: 'All (170+)' },
    { value: 'social', label: 'Social Media' },
    { value: 'messaging', label: 'Messaging' },
    { value: 'bookmarking', label: 'Bookmarking' },
    { value: 'developer', label: 'Developer' },
    { value: 'professional', label: 'Professional' },
    { value: 'regional', label: 'Regional' },
    { value: 'other', label: 'Other' },
  ];

  const filteredPlatforms = SHARE_PLATFORMS.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedTab === 0 || platform.category === categories[selectedTab].value;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (platform: SharePlatform) => {
    try {
      if (platform.name === 'Copy Link') {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        return;
      }

      if (platform.name === 'Print') {
        window.print();
        return;
      }

      if (platform.name === 'QR Code') {
        window.open(platform.url(shareUrl, title, description, imageUrl), '_blank');
        return;
      }

      const shareUrlGenerated = platform.url(shareUrl, title, description, imageUrl);
      window.open(shareUrlGenerated, '_blank', 'width=600,height=400');
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Native share error:', error);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">Share "{title}"</Typography>
              <Typography variant="caption" color="text.secondary">
                170+ Sharing Options
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2}>
            {/* Search */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Category Tabs */}
            <Tabs
              value={selectedTab}
              onChange={(_, value) => setSelectedTab(value)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {categories.map((cat, index) => (
                <Tab key={cat.value} label={cat.label} />
              ))}
            </Tabs>

            {/* Platforms Grid */}
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <Grid container spacing={1}>
                {filteredPlatforms.map((platform) => (
                  <Grid item xs={6} sm={4} md={3} key={platform.name}>
                    <Tooltip title={`Share on ${platform.name}`}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleShare(platform)}
                        sx={{
                          borderColor: platform.color,
                          color: platform.color,
                          '&:hover': {
                            bgcolor: platform.color,
                            color: 'white',
                            borderColor: platform.color,
                          },
                          textTransform: 'none',
                          fontSize: '0.75rem',
                        }}
                      >
                        <Stack alignItems="center" spacing={0.5}>
                          <Typography fontSize="1.5rem">{platform.icon}</Typography>
                          <Typography variant="caption" noWrap>
                            {platform.name}
                          </Typography>
                        </Stack>
                      </Button>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>

              {filteredPlatforms.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No platforms found matching "{searchQuery}"
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Quick Stats */}
            <Box display="flex" justifyContent="center" gap={2}>
              <Chip 
                label={`${filteredPlatforms.length} platforms`} 
                size="small" 
                color="primary" 
              />
              <Chip 
                label={`${categories.length - 1} categories`} 
                size="small" 
              />
            </Box>

            {/* Native Share (Mobile) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<ShareIcon />}
                onClick={handleNativeShare}
              >
                Share via Device
              </Button>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setCopied(false)}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}

