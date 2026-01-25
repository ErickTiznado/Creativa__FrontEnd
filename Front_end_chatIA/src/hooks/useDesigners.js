import { useState, useEffect } from "react";
import { getDesigners } from "../services/designerService";

/**
 * Custom hook for fetching and managing the designers list.
 *
 * @returns {Object} Designers state { designers, loading, error }
 */
export const useDesigners = () => {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        setLoading(true);
        const data = await getDesigners();
        setDesigners(data || []);
      } catch (err) {
        console.error("Error fetching designers:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigners();
  }, []);

  return { designers, loading, error };
};
