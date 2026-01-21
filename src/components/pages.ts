import { html } from 'hono/html'

export const HomePage = () => html`
<div class="font-serif max-w-[428px] mx-auto px-4 py-4 flex flex-col min-h-screen bg-0k text-5000k">
  <!-- Search Bar -->
  <div class="bg-dark-1 border-2 border-1700k rounded-3xl px-5 py-3 mb-4 flex items-center justify-center">
    <span class="text-5000k text-xl font-bold">Q</span>
  </div>

  <!-- Tabs -->
  <div class="flex gap-2 mb-6 border-2 border-1700k rounded-[32px] p-1 bg-dark-1">
    <div class="flex-1 px-4 py-3 rounded-[28px] text-center cursor-pointer text-base font-bold transition-all bg-1700k text-0k">
      Fridge
    </div>
    <div class="flex-1 px-4 py-3 rounded-[28px] text-center cursor-pointer text-base font-bold transition-all bg-transparent text-5000k">
      Freezer
    </div>
    <div class="flex-1 px-4 py-3 rounded-[28px] text-center cursor-pointer text-base font-bold transition-all bg-transparent text-5000k">
      Pantry
    </div>
  </div>

  <!-- Items Grid -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 flex-1">
    <!-- Filled Item Card -->
    <div class="bg-dark-1 border-2 border-1700k rounded-[20px] aspect-square p-4 flex flex-col items-center justify-center gap-2 relative">
      <div class="absolute top-3 left-3 text-sm text-5000k">@ 3 days</div>
      <div class="w-[60px] h-[60px] border-2 border-5000k rounded-full flex items-center justify-center bg-dark-2">
        <span class="text-lg font-bold text-5000k">Soul</span>
      </div>
      <div class="text-base text-5000k italic">Eat</div>
    </div>

    <!-- Empty Cards -->
    <div class="bg-dark-1 border-2 border-1700k rounded-[20px] aspect-square"></div>
    <div class="bg-dark-1 border-2 border-1700k rounded-[20px] aspect-square"></div>
    <div class="bg-dark-1 border-2 border-1700k rounded-[20px] aspect-square"></div>
    <div class="bg-dark-1 border-2 border-1700k rounded-[20px] aspect-square"></div>
    <div class="bg-dark-1 border-2 border-1700k rounded-[20px] aspect-square"></div>
  </div>

  <!-- Add Item Button -->
  <div class="bg-dark-1 border-3 border-1700k rounded-[28px] px-5 py-5 text-center text-2xl font-bold text-5000k cursor-pointer transition-all hover:bg-1700k hover:text-0k mt-auto">
    Add Item
  </div>
</div>
`
