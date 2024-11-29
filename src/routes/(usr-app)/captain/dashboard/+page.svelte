<script lang="ts">
  import QRCode from "@castlenine/svelte-qrcode";
  import {
    Html5Qrcode,
    type QrcodeErrorCallback,
    type QrcodeSuccessCallback,
  } from "html5-qrcode";
  import { onMount } from "svelte";
  import type { PageServerData } from "./$types";

  let scanning = false;

  let html5Qrcode: Html5Qrcode;
  const init = () => {
    html5Qrcode = new Html5Qrcode("reader");
  };

  const stop = async () => {
    if (html5Qrcode.isScanning) {
      html5Qrcode.stop();
    }
  };
  const start = async () => {
    html5Qrcode.start(
      { facingMode: "environment" },
      {
        fps: 2,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          return {
            width: viewfinderWidth * 0.8,
            height: viewfinderHeight * 0.8,
          };
        },
      },
      onScanSuccess,
      onScanFailure
    );
  };

  const onScanSuccess: QrcodeSuccessCallback = async (decodedText, _) => {
    const res = await fetch("/api/captain/check-in-user/", {
      method: "POST",
      body: decodedText,
    });
    await res.json();
    html5Qrcode.stop().then(() => {
      const closeModalButton = document.getElementById("close-modal");
      closeModalButton!.click();
      window.location.reload();
    });
  };

  const onScanFailure: QrcodeErrorCallback = (error) => {
    console.warn(`Code scan error = ${error}`);
  };
  onMount(() => {
    init();
  });
  let { data }: { data: PageServerData } = $props();

  const { allConfirmedBookingsForToday } = data;
</script>

<svelte:head>
  <title>Lab Man • Captain</title>
</svelte:head>

<header class="pb-10 h-[1/7]">
  <h2 class="text-2xl md:text-4xl">Captain Dashboard</h2>
</header>

<section aria-labelledby="captain-dashboard" class="flex flex-col h-1/2">
  <h3 id="captain-dashboard" class="text-xl md:text-3xl py-5">Bookings</h3>
  {#if allConfirmedBookingsForToday.length === 0}
    <p>You have no users to check-in today. ¯\_(ツ)_/¯</p>
  {:else}
    <p id="captain-dashboard" class="text-lg md:text-2xl">
      <strong>Time slot:&nbsp;</strong
      >{allConfirmedBookingsForToday[0].startTime.slice(0, 5)} - {allConfirmedBookingsForToday[0].endTime.slice(
        0,
        5
      )}
    </p>
    <p id="captain-dashboard" class="text-lg md:text-2xl py-2">
      <strong>Captains:&nbsp;</strong
      >{allConfirmedBookingsForToday[0].captains.join(", ")}
    </p>
    <div class="flex py-3">
      <div
        class="border-base-content/25 rounded-box w-full md:w-2/3 overflow-x-auto border"
      >
        <table class="table">
          <thead>
            <tr>
              <th>Usernames</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {#each allConfirmedBookingsForToday as row}
              {#each row.usernames as username}
                <tr>
                  <td class="text-nowrap">
                    {username}
                  </td>
                  <td class="text-nowrap">
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        class="btn btn-outline btn-success btn-xs"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-controls="middle-center-modal"
                        onclick={start}
                        data-overlay="#middle-center-modal">Accept</button
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
                              class="flex flex-col items-center justify-center"
                            >
                              <button
                                id="close-modal"
                                type="button"
                                class="btn btn-text btn-circle btn-lg absolute end-3 top-3 z-50"
                                aria-label="Close"
                                data-overlay="#middle-center-modal"
                                onclick={stop}
                              >
                                <span class="icon-[tabler--x] size-10"></span>
                              </button>
                              <reader id="reader" class="w-full h-full"
                              ></reader>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        class="btn btn-outline btn-error btn-xs"
                        aria-label="Cancel action button"
                        class:hidden={!row.checkedInUsers?.includes(username)}
                        onclick={async (e) => {
                          e.preventDefault();
                          const res = await fetch(
                            "/api/captain/cancel-user-check-in/",
                            {
                              method: "DELETE",
                              body: JSON.stringify({
                                id: row.id,
                                username: username,
                              }),
                            }
                          );
                          await res.json();
                          window.location.reload();
                        }}>Cancel check-in</button
                      >
                    </div>
                  </td>
                </tr>
              {/each}
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</section>