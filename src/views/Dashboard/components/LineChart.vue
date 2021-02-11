<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ['title'],
  mounted() {
    this.renderChart(
      {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            label: 'Total Transaksi',
            data: [2, 10, 5, 9, 0, 6, 20],
            backgroundColor: "transparent",
            borderColor: "#3987D5",
            pointBackgroundColor: "#3987D5"
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: this.title
        },
        legend: {
          display: false
        }
      }
    );
  }
};
</script>
