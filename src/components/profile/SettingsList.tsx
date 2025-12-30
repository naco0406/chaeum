'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bell, Moon, ChevronRight, HelpCircle, FileText } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface SettingsListProps {
  contrastColor?: string;
}

interface SettingsItemProps {
  icon: FC<{ className?: string }>;
  label: string;
  description?: string;
  action?: 'switch' | 'navigate';
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onClick?: () => void;
  index: number;
  contrastColor?: string;
}

const SettingsItem: FC<SettingsItemProps> = ({
  icon: Icon,
  label,
  description,
  action = 'navigate',
  checked,
  onCheckedChange,
  onClick,
  index,
  contrastColor,
}) => {
  const textColor = contrastColor || 'currentColor';

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      className="flex items-center gap-3 py-3.5"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: contrastColor ? `${contrastColor}10` : 'var(--secondary-50)',
        }}
      >
        <Icon
          className="w-4 h-4"
          style={{ color: textColor, opacity: 0.7 }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: textColor }}>
          {label}
        </p>
        {description && (
          <p
            className="text-xs"
            style={{ color: textColor, opacity: 0.6 }}
          >
            {description}
          </p>
        )}
      </div>
      {action === 'switch' ? (
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      ) : (
        <ChevronRight
          className="w-4 h-4"
          style={{ color: textColor, opacity: 0.5 }}
        />
      )}
    </motion.div>
  );

  if (action === 'navigate' && onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left transition-colors rounded-xl px-3 -mx-3"
        style={{
          backgroundColor: 'transparent',
        }}
      >
        {content}
      </button>
    );
  }

  return <div className="px-0">{content}</div>;
};

export const SettingsList: FC<SettingsListProps> = ({ contrastColor }) => {
  const router = useRouter();
  const textColor = contrastColor || 'currentColor';

  const handleNotificationChange = (checked: boolean) => {
    console.log('Notification:', checked);
  };

  const handleDarkModeChange = (checked: boolean) => {
    console.log('Dark mode:', checked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-3xl backdrop-blur-md p-5"
      style={{
        backgroundColor: contrastColor ? `${contrastColor}08` : 'var(--glass-strong)',
        border: contrastColor
          ? `1px solid ${contrastColor}15`
          : '1px solid var(--border-30)',
      }}
    >
      <h3
        className="text-base font-serif mb-2 text-center"
        style={{ color: textColor }}
      >
        설정
      </h3>
      <div className="space-y-1">
        <SettingsItem
          icon={Bell}
          label="알림"
          description="일기 작성 리마인더"
          action="switch"
          checked={false}
          onCheckedChange={handleNotificationChange}
          index={0}
          contrastColor={contrastColor}
        />
        <SettingsItem
          icon={Moon}
          label="다크 모드"
          description="어두운 테마 사용"
          action="switch"
          checked={false}
          onCheckedChange={handleDarkModeChange}
          index={1}
          contrastColor={contrastColor}
        />
        <div
          className="h-px my-2"
          style={{
            backgroundColor: contrastColor ? `${contrastColor}15` : 'var(--border-50)',
          }}
        />
        <SettingsItem
          icon={HelpCircle}
          label="도움말"
          onClick={() => router.push('/help')}
          index={2}
          contrastColor={contrastColor}
        />
        <SettingsItem
          icon={FileText}
          label="이용약관"
          onClick={() => router.push('/terms')}
          index={3}
          contrastColor={contrastColor}
        />
      </div>
    </motion.div>
  );
};
