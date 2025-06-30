import { Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

const ShareButton = ({ 
  title = 'Sakura Sathi Connect',
  text = 'Check out this amazing companion service platform',
  url,
  className,
  variant = 'outline',
  size = 'default'
}: ShareButtonProps) => {
  const { shareContent } = usePWA();
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url: url || window.location.href,
    };

    const success = await shareContent(shareData);
    
    if (!success) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url || '');
        toast({
          title: 'Link copied!',
          description: 'The link has been copied to your clipboard.',
        });
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        toast({
          title: 'Share failed',
          description: 'Unable to share or copy the link.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={className}
    >
      <Share2 className="w-4 h-4 mr-2" />
      Share
    </Button>
  );
};

export default ShareButton;
