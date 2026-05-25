/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDb } from '../dbContext';

export default function AnnouncementBar() {
  const { headerSettings } = useDb();

  if (!headerSettings.showAnnouncement) return null;

  return (
    <div className={`w-full py-2.5 px-4 text-center text-xs font-mono font-medium tracking-wide border-b border-white/10 ${headerSettings.announcementBgColor} ${headerSettings.announcementTextColor} flex items-center justify-center transition-all duration-300`}>
      <span className="truncate max-w-full">{headerSettings.announcementText}</span>
    </div>
  );
}
