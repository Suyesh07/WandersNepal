(function () {
  const form = document.querySelector("#cost-calculator");
  const output = document.querySelector("#cost-output");
  if (!form || !output) return;
  const rates = {
    accommodation: { budget: 1800, mid: 6500, premium: 18000 },
    food: { budget: 1600, mid: 4200, premium: 9000 },
    transport: { budget: 900, mid: 2800, premium: 8000 },
    activities: { budget: 500, mid: 2200, premium: 6000 },
    trekking: { budget: 0, mid: 2500, premium: 6500 },
    guide: { budget: 0, mid: 3500, premium: 8000 },
  };
  function money(value) {
    return new Intl.NumberFormat("en-NP", { maximumFractionDigits: 0 }).format(
      Math.round(value / 100) * 100
    );
  }
  function calculate() {
    const data = new FormData(form);
    const days = Math.max(1, Math.min(90, Number(data.get("days")) || 1));
    const totals = { budget: 0, mid: 0, premium: 0 };
    Object.keys(rates).forEach((key) => {
      if (
        data.get(key) === "on" ||
        ["accommodation", "food", "transport"].includes(key)
      ) {
        Object.keys(totals).forEach(
          (tier) => (totals[tier] += rates[key][tier] * days)
        );
      }
    });
    output.innerHTML = `<p class="kicker">Estimated Nepal trip cost</p><h2>${days} days</h2>
      <div class="estimate-output">
        <div class="estimate-row"><span>Budget</span><strong>NPR ${money(
          totals.budget
        )}</strong></div>
        <div class="estimate-row"><span>Mid-range</span><strong>NPR ${money(
          totals.mid
        )}</strong></div>
        <div class="estimate-row"><span>Premium</span><strong>NPR ${money(
          totals.premium
        )}</strong></div>
      </div><p>Estimates only. Prices vary by season, destination and provider. International flights, permits and emergency costs are not included.</p>`;
  }
  form.addEventListener("input", calculate);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
  });
  calculate();
})();
