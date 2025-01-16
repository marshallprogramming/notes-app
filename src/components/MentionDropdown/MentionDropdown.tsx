import { FC, useEffect, useState } from "react";
import { useMentionsStore } from "../../hooks/useMentionsStore";
import { UserForMention } from "../../services/users";

interface MentionDropdownProps {
  query: string;
  position: { top: number; left: number };
  onSelect: (username: string) => void;
}

const MentionDropdown: FC<MentionDropdownProps> = ({
  query,
  position,
  onSelect,
}) => {
  const searchMentions = useMentionsStore((s) => s.searchMentions);
  const [results, setResults] = useState<ReadonlyArray<UserForMention>>([]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const found = searchMentions(query.trim());
      setResults(found);
    } else {
      setResults([]);
    }
  }, [query, searchMentions]);

  if (!query || results.length === 0) {
    return null;
  }

  return (
    <ul
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 9999,
      }}
      className="border bg-white shadow-lg rounded-md w-56 list-none m-0 p-0"
    >
      {results.map((user: any) => (
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
