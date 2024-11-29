<script lang="ts">
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();

  const { allConfirmedBookingsForToday, allConfirmedBookingsForTomorrow } =
    data;
</script>

<svelte:head>
  <title>Lab Man • Admin</title>
</svelte:head>
<header class="pb-10 h-[1/7]">
  <h2 class="text-2xl md:text-4xl">
    Welcome, <strong>{data.username}</strong>
  </h2>
</header>

<section class="flex flex-col h-[6/7] gap-5">
  <section
    aria-labelledby="confirmed-bookings-today"
    class="flex flex-col h-1/2"
  >
    <h3 id="confirmed-bookings-today" class="text-xl md:text-3xl py-5">
      Confirmed Bookings for Today
    </h3>
    {#if allConfirmedBookingsForToday.length === 0}
      <p>No confirmed bookings. ¯\_(ツ)_/¯</p>
    {:else}
      <div
        class="border-base-content/25 rounded-box w-full overflow-x-auto border"
      >
        <table class="table">
          <thead>
            <tr>
              <th>Time slot</th>
              <th>Usernames</th>
              <th>Captains</th>
            </tr>
          </thead>
          <tbody>
            {#each allConfirmedBookingsForToday as row}
              <tr>
                <td class="text-nowrap"
                  >{row.startTime.slice(0, 5)} - {row.endTime.slice(0, 5)}</td
                >
                <td class="text-nowrap">
                  {row.usernames.join(", ")}
                </td>
                <td class="text-nowrap">
                  {row.captains.join(", ")}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
  <section
    aria-labelledby="confirmed-bookings-tomorrow"
    class="flex flex-col h-1/2"
  >
    <h3 id="confirmed-bookings-tomorrow" class="text-xl md:text-3xl py-5">
      Confirmed Bookings for Tomorrow
    </h3>
    {#if allConfirmedBookingsForTomorrow.length === 0}
      <p>No confirmed bookings. ¯\_(ツ)_/¯</p>
    {:else}
      <div
        class="border-base-content/25 rounded-box w-full overflow-x-auto border"
      >
        <table class="table">
          <thead>
            <tr>
              <th>Time slot</th>
              <th>Usernames</th>
              <th>Captains</th>
            </tr>
          </thead>
          <tbody>
            {#each allConfirmedBookingsForTomorrow as row}
              <tr>
                <td class="text-nowrap"
                  >{row.startTime.slice(0, 5)} - {row.endTime.slice(0, 5)}</td
                >
                <td class="text-nowrap">
                  {row.usernames.join(", ")}
                </td>
                <td class="text-nowrap">
                  {row.captains.join(", ")}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</section>
