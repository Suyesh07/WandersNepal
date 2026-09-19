(function () {
  const form = document.querySelector("#trip-planner-form");
  const output = document.querySelector("#planner-output");
  if (!form || !output) return;

  const plans = {
    3: {
      route: [["Kathmandu Valley", "3 nights"]],
      note: "Use one base. Patan, Boudhanath and Bhaktapur give the trip depth without a long transfer.",
      itinerary: "3",
    },
    5: {
      route: [
        ["Kathmandu", "2 nights"],
        ["Pokhara", "3 nights"],
      ],
      note: "Fly one direction or accept that road travel uses much of a day.",
      itinerary: "5",
    },
    7: {
      route: [
        ["Kathmandu", "3 nights"],
        ["Pokhara", "4 nights"],
      ],
      note: "Add a ridge walk or an overnight in Ghandruk rather than a third distant region.",
      itinerary: "7",
    },
    10: {
      route: [
        ["Kathmandu", "3 nights"],
        ["Chitwan", "3 nights"],
        ["Pokhara", "4 nights"],
      ],
      note: "A balanced culture, wildlife and lake route with one clear buffer day.",
      itinerary: "10",
    },
    14: {
      route: [
        ["Kathmandu", "3 nights"],
        ["Bandipur", "2 nights"],
        ["Pokhara", "3 nights"],
        ["Ghandruk", "3 nights"],
        ["Pokhara", "3 nights"],
      ],
      note: "A slower westbound journey with a short village trek.",
      itinerary: "14",
    },
    21: {
      route: [
        ["Kathmandu", "3 nights"],
        ["Selected trek", "13 nights"],
        ["Pokhara", "3 nights"],
        ["Kathmandu", "2 nights"],
      ],
      note: "Choose one major trek and protect the final two days for weather and recovery.",
      itinerary: "21",
    },
  };

  function readChecked(name) {
    return [...form.querySelectorAll(`[name="${name}"]:checked`)].map(
      (input) => input.value
    );
  }

  function render() {
    const days = Number(form.elements.days.value || 10);
    const interests = readChecked("interests");
    const style = form.elements.style.value;
    const ability = form.elements.ability.value;
    const travelType = form.elements.travelType.value;
    const base = plans[days] || plans[21];
    let route = base.route.map((stop) => [...stop]);
    let note = base.note;
    if (interests.includes("Trekking") && ability !== "None" && days >= 7) {
      route =
        days >= 14
          ? [
              ["Kathmandu", "2 nights"],
              ["Pokhara", "2 nights"],
              ["Annapurna trek", `${days - 6} nights`],
              ["Pokhara", "1 night"],
              ["Kathmandu", "1 night"],
            ]
          : [
              ["Kathmandu", "2 nights"],
              ["Pokhara", "2 nights"],
              ["Ghandruk", "2 nights"],
              ["Pokhara", "1 night"],
            ];
      note =
        ability === "Beginner"
          ? "Keep the trek short, use a conservative pace and choose an established lodge route."
          : "Match altitude and daily distance to experience; the route is a starting point, not a booking.";
    } else if (
      interests.includes("Wildlife") &&
      interests.includes("Spiritual") &&
      days >= 14
    ) {
      route = [
        ["Kathmandu", "3 nights"],
        ["Chitwan", "3 nights"],
        ["Lumbini", "2 nights"],
        ["Pokhara", `${days - 9} nights`],
        ["Kathmandu", "1 night"],
      ];
      note =
        "This route connects heritage, wildlife and pilgrimage without relying on a same-day cross-country connection.";
    } else if (interests.includes("Wildlife") && days >= 7) {
      route = [
        ["Kathmandu", "2 nights"],
        ["Chitwan", "2 nights"],
        ["Pokhara", `${days - 4} nights`],
      ];
      note =
        "Use two Chitwan nights for a full habitat day and choose naturalist-led activities with no elephant rides.";
    } else if (interests.includes("Spiritual") && days >= 10) {
      route = [
        ["Kathmandu", "2 nights"],
        ["Lumbini", "2 nights"],
        ["Pokhara", `${days - 6} nights`],
        ["Kathmandu", "2 nights"],
      ];
      note =
        "Treat Lumbini as a contemplative stop, not a rushed monument visit, and verify the long transfer before departure.";
    } else if (interests.includes("Relaxation") && days >= 5) {
      route = [
        ["Kathmandu", "2 nights"],
        ["Pokhara", `${days - 2} nights`],
      ];
      note =
        "Use fewer bases, keep mornings flexible and choose one optional day trip rather than filling every day.";
    } else if (
      (interests.includes("Culture") || interests.includes("Food")) &&
      days >= 5
    ) {
      route =
        days >= 10
          ? [
              ["Kathmandu Valley", "4 nights"],
              ["Bandipur", "2 nights"],
              ["Pokhara", `${days - 7} nights`],
              ["Kathmandu", "1 night"],
            ]
          : [
              ["Kathmandu Valley", `${Math.max(3, days - 2)} nights`],
              ["Bhaktapur or Panauti", "2 nights"],
            ];
      note =
        "Build the route around neighbourhoods, markets and locally run stays, with time for context rather than checklist sightseeing.";
    } else if (
      (interests.includes("Mountains") || interests.includes("Photography")) &&
      days >= 7
    ) {
      route = [
        ["Kathmandu", "2 nights"],
        ["Pokhara", `${days >= 10 ? 3 : 2} nights`],
        ["Ghandruk or Australian Camp", `${days >= 10 ? days - 6 : 2} nights`],
        ["Pokhara", "1 night"],
      ];
      note =
        "Keep sunrise plans flexible: cloud and haze matter more than a fixed viewpoint schedule.";
    }
    const pace =
      travelType === "Family"
        ? "Keep transfer days short and retain an easy fallback activity."
        : travelType === "Solo"
        ? "Share the working route and transport details with someone you trust."
        : "Confirm room and transport arrangements for the whole group before long transfer days.";
    output.innerHTML = `<p class="kicker">Your Nepal journey</p>
      <h2>${days === 21 ? "21+ days" : `${days} days`}</h2>
      <p>${style} travel · ${travelType.toLowerCase()} · ${ability.toLowerCase()} trekking${
      interests.length ? ` · ${interests.join(" + ")}` : ""
    }</p>
      <div class="result-route">${route
        .map(([stop, stay]) => `<span>${stop}<small>${stay}</small></span>`)
        .join("")}</div>
      <p>${note} ${pace}</p>
      <div class="planner-links"><a class="button secondary" href="/itineraries/${
        base.itinerary
      }-days">Open the matching itinerary</a><a class="button secondary" href="/tools/nepal-trip-cost">Estimate this trip</a></div>`;
  }
  form.addEventListener("change", render);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
    output.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  render();
})();
