import React, { useState, useEffect } from "react";

export default function ShellRunWeek({ enableVolunteerEditing, currentUser }) {
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shellruns")
      .then((res) => res.json())
      .then((data) => {
        setWeekData(data);
        setLoading(false);
      })
      .catch(() => {
        setWeekData(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading shell runs...</div>;
  if (!weekData) return <div>Error loading shell runs.</div>;

  return (
    <div>
      <h2>Shell Runs This Week</h2>
      <ul>
        {weekData.map((run) => (
          <li key={run.id}>
            {run.date} - Volunteer 1: {run.volunteer1 || "Unassigned"}
          </li>
        ))}
      </ul>
    </div>
  );
}
