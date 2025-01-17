import { FC, useEffect, useState } from "react";
import { useMentionsStore } from "../../hooks/useMentionsStore";
import { UserForMention } from "../../services/users";

interface MentionDropdownProps {
  showMentions: boolean;
  query: string;
  position: { top: number; left: number };
  onSelect: (username: string) => void;
}

const MentionDropdown: FC<MentionDropdownProps> = ({
  showMentions,
  query,
  position,
  onSelect,
}) => {
  const searchMentions = useMentionsStore((s) => s.searchMentions);
  const [results, setResults] = useState<ReadonlyArray<UserForMention>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length > 0) {
      setIsLoading(true);
      // Small delay to prevent flickering and give a smoother feel
      const timer = setTimeout(() => {
        const found = searchMentions(query.trim());
        setResults(found);
        setIsLoading(false);
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query, searchMentions]);

  return (
    <ul
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 9999,
      }}
      className={`border bg-white shadow-lg rounded-md w-56 list-none m-0 p-0 transform transition-opacity
      duration-300 ease-in-out ${
        showMentions ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {query.length === 0 && (
        <li className="px-4 py-2 text-gray-500 italic">
          Type to search for users...
        </li>
      )}

      {query.length > 0 && isLoading && (
        <li className="px-4 py-2 text-gray-500 flex items-center gap-2">
          {/* <Loader2 className="w-4 h-4 animate-spin" /> */}
          Searching...
        </li>
      )}

      {query.length > 0 && !isLoading && results.length === 0 && (
        <li className="px-4 py-2 text-gray-500">No users found</li>
      )}

      {results.map((user) => (
        <li
          key={user.username}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(user.username)}
        >
          <strong>@{user.username}</strong> <span>({user.fullName})</span>
        </li>
      ))}
    </ul>
  );
};

export default MentionDropdown;
