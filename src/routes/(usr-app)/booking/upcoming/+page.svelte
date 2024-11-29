<script lang="ts">
  import QRCode from "@castlenine/svelte-qrcode";
  import "../../../../app.css";
  import BookingsTable from "../../../../components/bookings-table.svelte";
  import type { PageServerData } from "./$types";
  let { data }: { data: PageServerData } = $props();

  const { upcomingUnconfirmedBookings, upcomingConfirmedBookings, username } =
    data;
</script>

<svelte:head>
  <title>Lab Man • Upcoming Bookings</title>
</svelte:head>

<header class="pb-10 h-[1/7]">
  <h2 class="text-2xl md:text-4xl">Upcoming Bookings</h2>
</header>

<section class="flex flex-col h-[6/7] gap-5">
  <section
    aria-labelledby="confirmed-bookings"
    class="flex flex-col h-1/2 overflow-auto"
  >
    <h3 id="confirmed-bookings" class="text-xl md:text-3xl py-5">
      Confirmed Bookings
    </h3>
    {#if upcomingConfirmedBookings.length === 0}
      <p>You have no confirmed bookings. ¯\_(ツ)_/¯</p>
      <p>
        To make a new booking request, go to
        <a class="underline" href="/booking/new">New booking</a>.
      </p>
    {:else}
      <div
        class="border-base-content/25 rounded-box w-full overflow-x-auto border"
      >
        <table class="table table-borderless">
          <thead>
            <tr>
              {#each ["Date", "Time", "Check-in code"] as header}
                <th>{header}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each upcomingConfirmedBookings as row}
              <tr>
                <td class="text-nowrap"
                  >{new Date(row.bookingDate).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}</td
                >
                <td class="text-nowrap"
                  >{row.startTime.slice(0, 5)} to {row.endTime.slice(0, 5)}</td
                >
                <td class="text-nowrap">
                  <button
                    type="button"
                    class="btn btn-outline btn-xs"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="middle-center-modal"
                    data-overlay="#middle-center-modal">Show QR Code</button
                  >

                  <div
                    id="middle-center-modal"
                    class="overlay modal overlay-open:opacity-100 modal-middle hidden"
                    role="dialog"
                    tabindex="-1"
                  >
                    <div class="modal-dialog overlay-open:opacity-100">
                      <div class="modal-content h-96">
                        <div
                          class="flex flex-col items-center justify-center w-full h-full"
                        >
                          <button
                            id="close-modal"
                            type="button"
                            class="btn btn-text btn-circle btn-lg absolute end-3 top-3 z-50"
                            aria-label="Close"
                            data-overlay="#middle-center-modal"
                          >
                            <span class="icon-[tabler--x] size-10"></span>
                          </button>
                          <QRCode
                            data={JSON.stringify({
                              id: row.id,
                              username: username,
                            })}
                          ></QRCode>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
  <section
    aria-labelledby="unconfirmed-bookings"
    class="flex flex-col h-1/2 overflow-auto"
  >
    <h3 id="unconfirmed-bookings" class="text-xl md:text-3xl py-5">
      Unconfirmed Bookings
    </h3>
    {#if upcomingUnconfirmedBookings.length === 0}
      <p>You have no unconfirmed bookings. ¯\_(ツ)_/¯</p>
      <p>
        To make a new booking request, go to
        <a class="underline" href="/booking/new">New booking</a>.
      </p>
    {:else}
      <BookingsTable
        tableHeaders={["Date", "Time", "Options"]}
        tableData={upcomingUnconfirmedBookings}
      />
    {/if}
  </section>
</section>
