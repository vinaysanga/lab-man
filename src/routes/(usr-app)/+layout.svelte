<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import type { Snippet } from "svelte";
  import "../../app.css";
  import type { LayoutData } from "./$types";
  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  async function logout(event: Event) {
    event.preventDefault();
    const res = await fetch("/api/logout", {
      method: "POST",
    });
    await res.json().then(() => goto("/login"));
  }
  afterNavigate(() => {
    HSStaticMethods.autoInit();
  });
  $effect(() => {
    window.HSStaticMethods.autoInit();
  });
</script>

<svelte:head>
  <title>Lab Man</title>
</svelte:head>

<main class="flex flex-col c bg-base-100">
  <header class="p-10">
    <nav
      class="navbar bg-base-200 rounded-box flex w-full gap-2 max-sm:flex-col sm:items-center"
    >
      <div class="flex max-sm:w-full items-center justify-between">
        <div class="navbar-start items-center justify-between max-sm:w-full">
          <a
            class="link text-base-content/90 link-neutral text-xl font-semibold no-underline"
            href="/dashboard"
          >
            Lab&nbsp;Man
          </a>
          <div class="sm:hidden">
            <button
              type="button"
              class="collapse-toggle btn btn-outline btn-secondary btn-sm btn-square"
              data-collapse="#solid-bg-navbar-collapse"
              aria-controls="solid-bg-navbar-collapse"
              aria-label="Toggle navigation"
            >
              <span class="icon-[tabler--menu-2] collapse-open:hidden size-4"
              ></span>
              <span class="icon-[tabler--x] collapse-open:block hidden size-4"
              ></span>
            </button>
          </div>
        </div>
      </div>
      <div
        id="solid-bg-navbar-collapse"
        class="sm:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-sm:w-full"
      >
        <ul class="menu sm:menu-horizontal flex-nowrap sm:gap-2 p-0 text-base">
          <li><a href="/dashboard">Dashboard</a></li>
          <li
            class="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]"
          >
            <button
              id="dropdown-link"
              type="button"
              class="dropdown-toggle dropdown-open:bg-base-content/10 dropdown-open:text-base-content"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              Bookings
              <span
                class="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"
              ></span>
            </button>
            <ul
              class="dropdown-menu dropdown-open:opacity-100 hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="dropdown-link"
            >
              <li>
                <a class="dropdown-item" href="/booking/new">New booking</a>
              </li>
              <li>
                <a class="dropdown-item" href="/booking/upcoming"
                  >Upcoming bookings</a
                >
              </li>
              <li>
                <a class="dropdown-item" href="/booking/previous"
                  >Previous bookings</a
                >
              </li>
            </ul>
          </li>
          <li>
            <button class="btn-outline btn-primary" onclick={logout}
              >Logout</button
            >
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <section class="p-10 w-full h-full">
    {@render children()}
  </section>
</main>
