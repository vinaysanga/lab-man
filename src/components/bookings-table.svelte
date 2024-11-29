<script lang="ts">
  import type { PageServerData } from "../routes/(usr-app)/dashboard/$types";


  const {
    tableHeaders,
    tableData,
  }: {
    tableHeaders: Array<string>;
    tableData:
      | PageServerData["confirmedBookings"]
      | PageServerData["unconfirmedBookings"];
  } = $props();
</script>

<div class="border-base-content/25 rounded-box w-full overflow-x-auto border">
  <table class="table table-borderless">
    <thead>
      <tr>
        {#each tableHeaders as header}
          <th>{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each tableData as row}
        <tr>
          <td class="text-nowrap"
            >{new Date(row.bookingDate).toLocaleDateString("it-IT", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}</td
          >
          <td class="text-nowrap">{row.startTime.slice(0, 5)} to {row.endTime.slice(0, 5)}</td>
          <td class="text-nowrap">
            <button
              class="btn btn-circle btn-text btn-sm"
              aria-label="Action button"
              onclick={async (e) => {
                e.preventDefault();
                const res = await fetch("/api/booking/delete", {
                  method: "DELETE",
                  body: JSON.stringify({ id: row.id }),
                });
                await res.json();
                window.location.reload();
              }}><span class="icon-[tabler--trash]"></span></button
            >
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
