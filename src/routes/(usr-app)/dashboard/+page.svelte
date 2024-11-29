<script lang="ts">
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();

  const { confirmedBookings, unconfirmedBookings } = data;
</script>

<svelte:head>
  <title>Lab Man • Dashboard</title>
</svelte:head>

<header class="pb-10 h-[1/7]">
  <h2 class="text-2xl md:text-4xl">
    Welcome, <strong>{data.username}</strong>
  </h2>
</header>

<section class="flex flex-col h-[6/7] gap-5">
  <section aria-labelledby="confirmed-bookings" class="flex flex-col h-1/2">
    <h3 id="confirmed-bookings" class="text-xl md:text-3xl py-5">
      Confirmed Bookings
    </h3>
    {#if confirmedBookings.length === 0}
      <p>You have no confirmed bookings. ¯\_(ツ)_/¯</p>
      <p>
        To make a new booking request, go to
        <a class="underline" href="/booking/new">New booking</a>.
      </p>
    {:else}
      <ul>
        {#each confirmedBookings as booking}
          <li class="flex items-center gap-2">
            <span class="text-green-500 font-bold">✓</span>
            <span>
              <strong>Date:</strong>
              {new Date(booking.bookingDate).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "2-digit",
                year: "numeric",
              })} <strong>Time:</strong>
              {booking.startTime.slice(0, 5)} to {booking.endTime.slice(0, 5)}
            </span>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
  <section aria-labelledby="unconfirmed-bookings" class="flex flex-col h-1/2">
    <h3 id="unconfirmed-bookings" class="text-xl md:text-3xl py-5">
      Unconfirmed Bookings
    </h3>
    {#if unconfirmedBookings.length === 0}
      <p>You have no unconfirmed bookings. ¯\_(ツ)_/¯</p>
      <p>
        To make a new booking request, go to
        <a class="underline" href="/booking/new">New booking</a>.
      </p>
    {:else}
      <p class="pb-3">
        To edit or cancel these, go to
        <a class="underline" href="/booking/upcoming">Upcoming bookings</a>.
      </p>
      <ul>
        {#each unconfirmedBookings as booking}
          <li class="flex items-center gap-2">
            <span class="text-red-500 font-bold">!</span>
            <span>
              <strong>Date:</strong>
              {new Date(booking.bookingDate).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "2-digit",
                year: "numeric",
              })} <strong>Time:</strong>
              {booking.startTime.slice(0, 5)} to {booking.endTime.slice(0, 5)}
            </span>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</section>
