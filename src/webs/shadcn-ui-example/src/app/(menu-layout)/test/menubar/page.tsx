'use client';

import { ContextMenuButton } from '@/components/context-menu-button/context-menu-button.component';

export default function Page() {
  return (
    <>
      <ContextMenuButton
        menuItems={[
          {
            render: 'Profile',
            onClick: () => {
              console.log('Profile Click!');
            },
          },
          {
            render: 'Billing',
            onClick: () => {
              console.log('Billing Click!');
            },
          },
          {
            render: 'Team',
            onClick: () => {
              console.log('Team Click!');
            },
          },
          {
            render: 'Subscription',
            onClick: () => {
              console.log('Subscription Click!');
            },
          },
        ]}
      />
    </>
  );
}
