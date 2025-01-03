// Fetch dashboard stats from the server
fetch('/dashboard-stats')
  .then(response => response.json())
  .then(data => {
    document.querySelector('.stat-card:nth-child(1) h2').textContent = data.total_members;
    document.querySelector('.stat-card:nth-child(2) h2').textContent = data.active_memberships;
    document.querySelector('.stat-card:nth-child(3) h2').textContent = `$${data.total_revenue}`;
    document.querySelector('.stat-card:nth-child(4) h2').textContent = data.todays_classes;
  })
  .catch(error => {
    console.error('Error fetching dashboard stats:', error);
  });
