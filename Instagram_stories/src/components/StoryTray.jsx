import StoryAvatar from './StoryAvatar';

export default function StoryTray({ users, seenUserIds, onUserClick }) {
  return (
    <div className="flex gap-4 overflow-x-auto px-3 py-3 snap-x no-scrollbar border-b border-ig-border">
      {users.map((user, index) => (
        <div key={user.id} className="snap-start">
          <StoryAvatar
            user={user}
            seen={seenUserIds.has(user.id)}
            onClick={() => onUserClick(user, index)}
          />
        </div>
      ))}
    </div>
  );
}
