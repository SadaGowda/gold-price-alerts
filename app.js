fetch("data/prices.json")
  .then((res) => res.json())
  .then((data) => {
    const prices = data.prices;
    const last = prices[prices.length - 1];

    document.getElementById("price").innerText = `₹ ${last.price}`;

    document.getElementById("change").innerText =
      last.change > 0
        ? `⬆️ +${last.change}`
        : last.change < 0
          ? `⬇️ ${last.change}`
          : `No change`;

    document.getElementById("updated").innerText =
      `Updated: ${new Date(last.timestamp).toLocaleString()}`;
  });
