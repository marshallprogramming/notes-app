import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { useMentionsStore } from "../../hooks/useMentionsStore";
import { UserForMention } from "../../services/users";

export interface MentionDropdownRef {
  measure: () => { width: number; height: number } | null;
}

interface MentionDropdownProps {
  showMentions: boolean;
  query: string;
  position: { top: number; left: number };
  onSelect: (username: string) => void;
}

const MentionDropdown = forwardRef<MentionDropdownRef, MentionDropdownProps>(
  ({ showMentions, query, position, onSelect }, ref) => {
    const searchMentions = useMentionsStore((s) => s.searchMentions);

    const containerRef = useRef<HTMLUListElement>(null);

    const [results, setResults] = useState<ReadonlyArray<UserForMention>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useImperativeHandle(ref, () => ({
      measure: () => {
        if (!containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
        };
      },
    }));

    useEffect(() => {
      setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
      if (query.trim().length > 0) {
        setIsLoading(true);
        const timer = setTimeout(() => {
          const foundUsers = searchMentions(query.trim());
          setResults(foundUsers);
          setIsLoading(false);
        }, 150);

        return () => clearTimeout(timer);
      } else {
        setResults([]);
        setIsLoading(false);
      }
    }, [query, searchMentions]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
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
            break;
        }
      };

      if (showMentions) {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }
    }, [showMentions, results, selectedIndex, onSelect]);

    if (!showMentions) return null;

    /**
     * Render the dropdown. This `ul` is absolutely positioned relative to
     * the parent container. We attach our `containerRef` here so we can measure it.
     */
    return (
      <ul
        ref={containerRef}
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          zIndex: 9999,
        }}
        className="border bg-white shadow-lg rounded-md w-56 list-none m-0 p-0"
      >
        {/** Instructions or states if the query is empty, loading, or no results */}
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

        {/** Render matching results */}
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
  }
);

export default MentionDropdown;
