'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Moon,
  ChevronRight,
  HelpCircle,
  FileText,
  Palette,
  Calendar,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useLayout, LayoutMode } from '@/contexts/LayoutContext';

interface SettingsListProps {
  contrastColor?: string;
}

interface SettingsItemProps {
  icon: FC<{ className?: string }>;
  label: string;
  description?: string;
  action?: 'switch' | 'navigate';
  checked?: boolean;
  disabled?: boolean;
  index: number;
  contrastColor?: string;
}

const SettingsItem: FC<SettingsItemProps> = ({
  icon: Icon,
  label,
  description,
  action = 'navigate',
  checked,
  disabled = false,
  index,
  contrastColor,
}) => {
  const textColor = contrastColor || 'currentColor';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      className="flex items-center gap-3 py-3.5 w-full"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: contrastColor ? `${contrastColor}10` : 'var(--secondary-50)',
        }}
      >
        <span style={{ color: textColor, opacity: 0.7 }}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium" style={{ color: textColor }}>
            {label}
          </p>
          {disabled && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${textColor}15`,
                color: textColor,
              }}
            >
              준비중
            </span>
          )}
        </div>
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
        <Switch checked={checked} disabled={disabled} />
      ) : (
        <ChevronRight
          className="w-4 h-4 flex-shrink-0"
          style={{ color: textColor, opacity: 0.5 }}
        />
      )}
    </motion.div>
  );
};

// 레이아웃 모드 탭 컴포넌트
const LayoutModeTabs: FC<{ contrastColor?: string }> = ({ contrastColor }) => {
  const { layoutMode, setLayoutMode } = useLayout();
  const textColor = contrastColor || 'currentColor';

  const tabs: { mode: LayoutMode; icon: typeof Palette; label: string }[] = [
    { mode: 'palette', icon: Palette, label: '컬러 팔레트' },
    { mode: 'calendar', icon: Calendar, label: '캘린더' },
  ];

  return (
    <div>
      <p
        className="text-xs mb-3 text-center font-medium"
        style={{ color: textColor, opacity: 0.7 }}
      >
        기록 보기 방식
      </p>
      <div
        className="flex gap-2 p-1.5 rounded-2xl"
        style={{ backgroundColor: `${textColor}10` }}
      >
        {tabs.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setLayoutMode(mode)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all"
            style={{
              backgroundColor: layoutMode === mode ? `${textColor}20` : 'transparent',
              color: textColor,
              opacity: layoutMode === mode ? 1 : 0.6,
            }}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const SettingsList: FC<SettingsListProps> = ({ contrastColor }) => {
  return (
    <div className="space-y-4">
      {/* 레이아웃 모드 탭 - 별도 카드 */}
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
        <LayoutModeTabs contrastColor={contrastColor} />
      </motion.div>

      {/* 설정 항목들 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="rounded-3xl backdrop-blur-md p-5"
        style={{
          backgroundColor: contrastColor ? `${contrastColor}08` : 'var(--glass-strong)',
          border: contrastColor
            ? `1px solid ${contrastColor}15`
            : '1px solid var(--border-30)',
        }}
      >
        <div className="space-y-1">
          <SettingsItem
            icon={Bell}
            label="알림"
            description="일기 작성 리마인더"
            action="switch"
            checked={false}
            disabled={true}
            index={0}
            contrastColor={contrastColor}
          />
          <SettingsItem
            icon={Moon}
            label="다크 모드"
            description="어두운 테마 사용"
            action="switch"
            checked={false}
            disabled={true}
            index={1}
            contrastColor={contrastColor}
          />
        </div>
      </motion.div>

      {/* 링크 항목들 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-3xl backdrop-blur-md p-5"
        style={{
          backgroundColor: contrastColor ? `${contrastColor}08` : 'var(--glass-strong)',
          border: contrastColor
            ? `1px solid ${contrastColor}15`
            : '1px solid var(--border-30)',
        }}
      >
        <div className="space-y-1">
          <SettingsItem
            icon={HelpCircle}
            label="도움말"
            description="앱 사용 안내"
            action="navigate"
            disabled={true}
            index={0}
            contrastColor={contrastColor}
          />
          <SettingsItem
            icon={FileText}
            label="이용약관"
            description="서비스 이용 정책"
            action="navigate"
            disabled={true}
            index={1}
            contrastColor={contrastColor}
          />
        </div>
      </motion.div>
    </div>
  );
};
