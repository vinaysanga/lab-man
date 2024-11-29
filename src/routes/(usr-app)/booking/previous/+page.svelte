<script lang="ts">
  import "../../../../app.css";
  import Table from "../../../../components/bookings-table.svelte";
  import type { PageServerData } from "./$types";
  let { data }: { data: PageServerData } = $props();

  const { previousUnconfirmedBookings, previousConfirmedBookings } = data;
</script>

<svelte:head>
  <title>Lab Man • Previous Bookings</title>
</svelte:head>

<header class="pb-10 h-[1/7]">
  <h2 class="text-2xl md:text-4xl">Previous Bookings</h2>
</header>
<section class="flex flex-col h-[6/7] gap-5">
  <section aria-labelledby="confirmed-bookings" class="flex flex-col h-1/2">
    <h3 id="confirmed-bookings" class="text-xl md:text-3xl py-5">
      Confirmed Bookings
    </h3>
    {#if previousConfirmedBookings.length === 0}
      <p>You have no confirmed bookings. ¯\_(ツ)_/¯</p>
      <p>
        To make a new booking request, go to
        <a class="underline" href="/booking/new">New booking</a>.
      </p>
    {:else}
      <Table
        tableHeaders={["Date", "Time", "Options"]}
        tableData={previousConfirmedBookings}
      />
    {/if}
  </section>
  <section aria-labelledby="unconfirmed-bookings" class="flex flex-col h-1/2">
    <h3 id="unconfirmed-bookings" class="text-xl md:text-3xl py-5">
      Unconfirmed Bookings
    </h3>
    {#if previousUnconfirmedBookings.length === 0}
      <p>You have no unconfirmed bookings. ¯\_(ツ)_/¯</p>
      <p>
        To make a new booking request, go to
        <a class="underline" href="/booking/new">New booking</a>.
      </p>
    {:else}
      <Table
        tableHeaders={["Date", "Time", "Options"]}
        tableData={previousUnconfirmedBookings}
      />
    {/if}
  </section>
</section>
