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
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // Reset selection when query changes
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (query.trim().length > 0) {
      setIsLoading(true);
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

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (!showMentions || results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + results.length) % results.length
          );
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            onSelect(results[selectedIndex].username);
          }
          break;
        case "Escape":
          e.preventDefault();
          // You might want to add a prop for handling escape
          break;
      }
    };

    if (showMentions) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showMentions, results, selectedIndex, onSelect]);

  if (!showMentions) return null;

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
      {query.length === 0 && (
        <li className="px-4 py-2 text-gray-500 italic">
          Type to search for users...
        </li>
      )}

      {query.length > 0 && isLoading && (
        <li className="px-4 py-2 text-gray-500 flex items-center gap-2">
          Searching...
        </li>
      )}

      {query.length > 0 && !isLoading && results.length === 0 && (
        <li className="px-4 py-2 text-gray-500">No users found</li>
      )}

      {results.map((user, index) => (
        <li
          key={user.username}
          className={`px-4 py-2 cursor-pointer ${
            index === selectedIndex ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
          onClick={() => onSelect(user.username)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <strong>@{user.username}</strong> <span>({user.fullName})</span>
        </li>
      ))}
    </ul>
  );
};

export default MentionDropdown;
