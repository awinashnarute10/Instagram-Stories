import StoryAvatar from './StoryAvatar';

export default function StoryTray({ users, seenStoryIds, onUserClick }) {
  return (
    <div className="flex gap-4 overflow-x-auto px-3 py-3 snap-x no-scrollbar border-b border-ig-border">
      {users.map((user, index) => {
        const allSeen = user.stories.every(s => seenStoryIds.has(s.id));
        return (
          <div key={user.id} className="snap-start">
            <StoryAvatar
              user={user}
              seen={allSeen}
              onClick={() => onUserClick(user, index)}
            />
          </div>
        );
      })}
    </div>
  );
}
