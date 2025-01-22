<script lang="ts">
  const {
    tableHeaders,
    tableData,
  }: {
    tableHeaders: Array<string>;
    tableData: any;
  } = $props();
</script>

<div class="border-base-content/10 rounded-box border p-2">
  <div class="enhanced-scrollbar max-h-[26rem] overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:h-2">
    <table class="table my-0">
      <thead class="bg-base-100 sticky top-0 z-30">
        <tr>
          {#each tableHeaders as header}
            <th>{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each tableData as row}
          <tr class="border-base-content/10">
            <td class="px-4 whitespace-nowrap">{row.username}</td>
            <td class="px-4">
              <label class="form-control flex items-center gap-1">
                <input
                  type="checkbox"
                  class="switch switch-error"
                  checked={row.restricted}
                  onchange={async (e: Event) => {
                    e.preventDefault();
                    const restricted = (e.target as HTMLInputElement).checked;
                    const res = await fetch("/api/user/update-restricted", {
                      method: "PATCH",
                      body: JSON.stringify({
                        username: row.username,
                        restricted,
                      }),
                    });
                    await res.json();
                    window.location.reload();
                  }}
                />
              </label>
            </td>
            <td class="px-4 whitespace-nowrap">
              <button
                class="btn btn-circle btn-text btn-sm"
                aria-label="Action button"
                onclick={async (e) => {
                  e.preventDefault();
                  const res = await fetch("/api/user/delete", {
                    method: "DELETE",
                    body: JSON.stringify({ username: row.username }),
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
</div>
