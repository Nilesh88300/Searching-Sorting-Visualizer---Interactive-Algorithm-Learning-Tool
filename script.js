/*document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const arrayInput = document.getElementById('array-input');
    const generateBtn = document.getElementById('generate-btn');
    const stopBtn = document.getElementById('stop-btn');
    const sortAlgoSelect = document.getElementById('sort-algo-select');
    const searchAlgoSelect = document.getElementById('search-algo-select');
    const sortStartBtn = document.getElementById('sort-start-btn');
    const searchStartBtn = document.getElementById('search-start-btn');
    const searchInput = document.getElementById('search-input');
    const barContainer = document.getElementById('bar-container');
    const speedSlider = document.getElementById('speed-slider');
    const algoTitle = document.getElementById('algo-title');
    const algoExplanation = document.getElementById('algo-explanation');
    const bestCase = document.getElementById('best-case');
    const avgCase = document.getElementById('avg-case');
    const worstCase = document.getElementById('worst-case');

    // --- STATE MANAGEMENT ---
    let animationSpeed = 300;
    let isRunning = false;
    let stopSignal = false;

    // --- ALGORITHM DATA (EXPANDED) ---
    const algoData = {
        bubble: { name: "Bubble Sort", explanation: "Bubble Sort is a basic algorithm that works by repeatedly swapping adjacent elements if they are in the wrong order. It's like bubbles rising to the surface; the largest values 'bubble up' to the end of the array with each pass. While simple to understand, it's inefficient for large lists.", best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
        selection: { name: "Selection Sort", explanation: "This algorithm divides the array into a sorted and an unsorted part. In each iteration, it finds the smallest element from the unsorted part and swaps it with the first element of the unsorted part, effectively growing the sorted section by one.", best: "O(n²)", avg: "O(n²)", worst: "O(n²)" },
        insertion: { name: "Insertion Sort", explanation: "Insertion sort builds the final sorted array one item at a time. It's much like how you would sort a hand of playing cards. It iterates through the input elements and inserts each element into its correct position in the sorted part of the array.", best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
        merge: { name: "Merge Sort", explanation: "A powerful 'Divide and Conquer' algorithm. It divides the array into two halves, calls itself for the two halves, and then merges the two sorted halves. This process is recursive and guarantees a fast performance, but requires extra memory for the merging process.", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
        quick: { name: "Quick Sort", explanation: "Also a 'Divide and Conquer' algorithm, often faster in practice than Merge Sort. It picks an element as a 'pivot', and partitions the array around the pivot, placing smaller elements to its left and larger ones to its right. This is done recursively on the sub-arrays.", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)" },
        heap: { name: "Heap Sort", explanation: "This is a comparison-based sorting technique based on a Binary Heap data structure. It first transforms the array into a max heap (where each parent node is larger than its children). It then repeatedly swaps the root (maximum element) with the last element and reduces the heap size by one, then heapifies the root.", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
        linear: { name: "Linear Search", explanation: "The most basic search algorithm. It sequentially checks each element of the list from the beginning until the target value is found. If it reaches the end of the list without finding the value, the search terminates unsuccessfully. It does not require the list to be sorted.", best: "O(1)", avg: "O(n)", worst: "O(n)" },
        binary: { name: "Binary Search", explanation: "A highly efficient search algorithm that works ONLY on sorted arrays. It repeatedly divides the search interval in half. If the target value is less than the middle element, it narrows the interval to the lower half; otherwise, to the upper half. This continues until the value is found or the interval is empty.", best: "O(1)", avg: "O(log n)", worst: "O(log n)" }
    };

    // --- EVENT LISTENERS ---
    generateBtn.addEventListener('click', resetAndGenerate);
    sortStartBtn.addEventListener('click', startSort);
    searchStartBtn.addEventListener('click', startSearch);
    stopBtn.addEventListener('click', () => { stopSignal = true; });
    speedSlider.addEventListener('input', (e) => { animationSpeed = 510 - e.target.value; });
    sortAlgoSelect.addEventListener('change', () => updateExplanation(sortAlgoSelect.value));
    searchAlgoSelect.addEventListener('change', () => updateExplanation(searchAlgoSelect.value));
    
    // --- CORE LOGIC ---
    function resetAndGenerate() {
        stopSignal = true;
        setTimeout(() => {
            stopSignal = false; isRunning = false;
            const randomArr = Array.from({ length: 25 }, () => Math.floor(Math.random() * 100) + 5);
            arrayInput.value = randomArr.join(',');
            generateBars();
            toggleControls(true);
        }, animationSpeed > 0 ? animationSpeed + 50 : 50);
    }
    
    async function startSort() {
        if (isRunning) return;
        isRunning = true; stopSignal = false; toggleControls(false);
        clearHighlights();
        const bars = Array.from(document.getElementsByClassName('bar'));
        const algo = sortAlgoSelect.value;
        switch(algo) {
            case 'bubble': await bubbleSort(bars); break;
            case 'selection': await selectionSort(bars); break;
            case 'insertion': await insertionSort(bars); break;
            case 'merge': await mergeSort(bars, 0, bars.length - 1); break;
            case 'quick': await quickSort(bars, 0, bars.length - 1); break;
            case 'heap': await heapSort(bars); break;
        }
        if (!stopSignal) { markAllSorted(bars); }
        isRunning = false; toggleControls(true);
    }

    async function startSearch() {
        if (isRunning) return;
        const bars = Array.from(document.getElementsByClassName('bar'));
        if (searchAlgoSelect.value === 'binary' && !isSorted(bars)) {
            alert('Binary Search requires a sorted array. Please sort it first!'); return;
        }
        isRunning = true; stopSignal = false; toggleControls(false);
        clearHighlights();
        if (searchAlgoSelect.value === 'linear') await linearSearch(bars);
        if (searchAlgoSelect.value === 'binary') await binarySearch(bars);
        isRunning = false; toggleControls(true);
    }
    
    // --- BAR & UI HELPERS ---
    function generateBars() {
        const arr = arrayInput.value.split(',').filter(n => n.trim() !== '').map(Number).filter(n => !isNaN(n));
        barContainer.innerHTML = '';
        arr.forEach(value => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${value * 3.5}px`;
            bar.dataset.value = value;
            bar.innerText = value;
            barContainer.appendChild(bar);
        });
    }

    function updateExplanation(selectedValue) {
        const data = algoData[selectedValue];
        algoTitle.innerText = data.name;
        algoExplanation.innerText = data.explanation;
        bestCase.innerText = data.best; avgCase.innerText = data.avg; worstCase.innerText = data.worst;
    }

    function toggleControls(enable) {
        generateBtn.disabled = !enable;
        sortStartBtn.disabled = !enable;
        searchStartBtn.disabled = !enable;
        arrayInput.disabled = !enable;
    }

    function clearHighlights() {
        document.querySelectorAll('.bar').forEach(b => b.classList.remove('comparing', 'swapping', 'pivot', 'sorted', 'found', 'pointer'));
    }

    async function markAllSorted(bars) {
        for (const bar of bars) { if (stopSignal) return; bar.classList.add('sorted'); await sleep(); }
    }

    function isSorted(bars) {
        for (let i = 0; i < bars.length - 1; i++) { if (parseInt(bars[i].dataset.value) > parseInt(bars[i + 1].dataset.value)) return false; }
        return true;
    }

    function sleep() { return new Promise(resolve => setTimeout(resolve, animationSpeed)); }
    
    function getValue(bar) { return parseInt(bar.dataset.value); }
    
    async function swapBars(bar1, bar2) {
        bar1.classList.add('swapping'); bar2.classList.add('swapping');
        await sleep();
        const tempHeight = bar1.style.height, tempValue = bar1.dataset.value, tempText = bar1.innerText;
        bar1.style.height = bar2.style.height; bar1.dataset.value = bar2.dataset.value; bar1.innerText = bar2.innerText;
        bar2.style.height = tempHeight; bar2.dataset.value = tempValue; bar2.innerText = tempText;
        await sleep();
        bar1.classList.remove('swapping'); bar2.classList.remove('swapping');
    }

    // --- ALGORITHM IMPLEMENTATIONS (FULL) ---

    async function bubbleSort(bars) {
        for (let i = 0; i < bars.length - 1; i++) {
            for (let j = 0; j < bars.length - i - 1; j++) {
                if (stopSignal) return;
                bars[j].classList.add('comparing'); bars[j + 1].classList.add('comparing');
                await sleep();
                if (getValue(bars[j]) > getValue(bars[j + 1])) { await swapBars(bars[j], bars[j + 1]); }
                bars[j].classList.remove('comparing'); bars[j + 1].classList.remove('comparing');
            }
            bars[bars.length - 1 - i].classList.add('sorted');
        }
        if (bars.length > 0) bars[0].classList.add('sorted');
    }

    async function selectionSort(bars) {
        for (let i = 0; i < bars.length - 1; i++) {
            let minIdx = i;
            bars[i].classList.add('pivot');
            for (let j = i + 1; j < bars.length; j++) {
                if (stopSignal) return;
                bars[j].classList.add('comparing');
                await sleep();
                if (getValue(bars[j]) < getValue(bars[minIdx])) { minIdx = j; }
                bars[j].classList.remove('comparing');
            }
            if (minIdx !== i) { await swapBars(bars[i], bars[minIdx]); }
            bars[i].classList.remove('pivot');
            bars[i].classList.add('sorted');
        }
        if (bars.length > 0) bars[bars.length - 1].classList.add('sorted');
    }

    async function insertionSort(bars) {
        for (let i = 1; i < bars.length; i++) {
            let keyBar = bars[i], j = i - 1;
            keyBar.classList.add('pivot');
            await sleep();
            while (j >= 0 && getValue(bars[j]) > getValue(keyBar)) {
                if (stopSignal) return;
                bars[j].classList.add('comparing');
                await swapBars(bars[j], bars[j+1]);
                bars[j].classList.remove('comparing');
                j--;
            }
            keyBar.classList.remove('pivot');
        }
    }

    async function mergeSort(bars, l, r) {
        if (l >= r) return;
        if (stopSignal) return;
        const m = l + Math.floor((r - l) / 2);
        await mergeSort(bars, l, m);
        await mergeSort(bars, m + 1, r);
        await merge(bars, l, m, r);
    }
    
    async function merge(bars, l, m, r) {
        const n1 = m - l + 1, n2 = r - m;
        let L = [], R = [];
        for (let i = 0; i < n1; i++) L.push({ val: getValue(bars[l+i]), height: bars[l+i].style.height, text: bars[l+i].innerText });
        for (let j = 0; j < n2; j++) R.push({ val: getValue(bars[m+1+j]), height: bars[m+1+j].style.height, text: bars[m+1+j].innerText });
        
        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (stopSignal) return;
            bars[k].classList.add('comparing');
            await sleep();
            if (L[i].val <= R[j].val) {
                bars[k].dataset.value = L[i].val; bars[k].style.height = L[i].height; bars[k].innerText = L[i].text; i++;
            } else {
                bars[k].dataset.value = R[j].val; bars[k].style.height = R[j].height; bars[k].innerText = R[j].text; j++;
            }
            bars[k].classList.remove('comparing'); k++;
        }
        while (i < n1) { if(stopSignal) return; bars[k].dataset.value = L[i].val; bars[k].style.height = L[i].height; bars[k].innerText = L[i].text; i++; k++; await sleep(); }
        while (j < n2) { if(stopSignal) return; bars[k].dataset.value = R[j].val; bars[k].style.height = R[j].height; bars[k].innerText = R[j].text; j++; k++; await sleep(); }
    }

    async function quickSort(bars, low, high) {
        if (low < high) {
            if (stopSignal) return;
            let pi = await partition(bars, low, high);
            await quickSort(bars, low, pi - 1);
            await quickSort(bars, pi + 1, high);
        }
    }
    
    async function partition(bars, low, high) {
        let pivotBar = bars[high];
        pivotBar.classList.add('pivot');
        let i = (low - 1);
        for (let j = low; j <= high - 1; j++) {
            if (stopSignal) return i;
            bars[j].classList.add('comparing');
            await sleep();
            if (getValue(bars[j]) < getValue(pivotBar)) {
                i++;
                await swapBars(bars[i], bars[j]);
            }
            bars[j].classList.remove('comparing');
        }
        await swapBars(bars[i + 1], bars[high]);
        pivotBar.classList.remove('pivot');
        return (i + 1);
    }
    
    async function heapSort(bars) {
        let n = bars.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            if(stopSignal) return; await heapify(bars, n, i);
        }
        for (let i = n - 1; i > 0; i--) {
            if(stopSignal) return;
            await swapBars(bars[0], bars[i]);
            bars[i].classList.add('sorted');
            await heapify(bars, i, 0);
        }
        if (n>0) bars[0].classList.add('sorted');
    }

    async function heapify(bars, n, i) {
        if(stopSignal) return;
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;
        bars[i].classList.add('pivot');
        if (l < n) bars[l].classList.add('comparing');
        if (r < n) bars[r].classList.add('comparing');
        await sleep();
        if (l < n && getValue(bars[l]) > getValue(bars[largest])) largest = l;
        if (r < n && getValue(bars[r]) > getValue(bars[largest])) largest = r;
        if (l < n) bars[l].classList.remove('comparing');
        if (r < n) bars[r].classList.remove('comparing');
        bars[i].classList.remove('pivot');
        if (largest != i) {
            await swapBars(bars[i], bars[largest]);
            await heapify(bars, n, largest);
        }
    }

    async function linearSearch(bars) {
        const target = parseInt(searchInput.value);
        if (isNaN(target)) { alert("Please enter a number to search."); return; }
        for (let i = 0; i < bars.length; i++) {
            if (stopSignal) return;
            bars[i].classList.add('comparing');
            await sleep();
            if (getValue(bars[i]) === target) {
                bars[i].classList.add('found'); return;
            }
            bars[i].classList.remove('comparing');
        }
        alert("Element not found.");
    }
    
    async function binarySearch(bars) {
        const target = parseInt(searchInput.value);
        if (isNaN(target)) { alert("Please enter a number to search."); return; }
        let low = 0, high = bars.length - 1;
        while (low <= high) {
            if (stopSignal) return;
            let mid = Math.floor(low + (high - low) / 2);
            bars[low].classList.add('pointer'); bars[high].classList.add('pointer');
            bars[mid].classList.add('comparing');
            await sleep();
            if (getValue(bars[mid]) === target) {
                bars[mid].classList.add('found'); return;
            }
            if (getValue(bars[mid]) < target) { low = mid + 1; }
            else { high = mid - 1; }
            bars[low-1]?.classList.remove('pointer'); bars[high+1]?.classList.remove('pointer');
            bars[mid].classList.remove('comparing');
        }
        alert("Element not found.");
    }

    // --- INITIALIZATION ---
    updateExplanation('bubble');
    resetAndGenerate();
});*/


document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const arrayInput = document.getElementById('array-input');
    const generateBtn = document.getElementById('generate-btn');
    const stopBtn = document.getElementById('stop-btn');
    const sortAlgoSelect = document.getElementById('sort-algo-select');
    const searchAlgoSelect = document.getElementById('search-algo-select');
    const sortStartBtn = document.getElementById('sort-start-btn');
    const searchStartBtn = document.getElementById('search-start-btn');
    const searchInput = document.getElementById('search-input');
    const barContainer = document.getElementById('bar-container');
    const speedSlider = document.getElementById('speed-slider');
    const algoTitle = document.getElementById('algo-title');
    const algoExplanation = document.getElementById('algo-explanation');
    const bestCase = document.getElementById('best-case');
    const avgCase = document.getElementById('avg-case');
    const worstCase = document.getElementById('worst-case');

    // --- STATE MANAGEMENT ---
    let animationSpeed = 300;
    let isRunning = false;
    let stopSignal = false;

    // --- ALGORITHM DATA (EXPANDED) ---
    const algoData = {
        bubble: { name: "Bubble Sort", explanation: "Bubble Sort is a basic algorithm that works by repeatedly swapping adjacent elements if they are in the wrong order. It's like bubbles rising to the surface; the largest values 'bubble up' to the end of the array with each pass. While simple to understand, it's inefficient for large lists.", best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
        selection: { name: "Selection Sort", explanation: "This algorithm divides the array into a sorted and an unsorted part. In each iteration, it finds the smallest element from the unsorted part and swaps it with the first element of the unsorted part, effectively growing the sorted section by one.", best: "O(n²)", avg: "O(n²)", worst: "O(n²)" },
        insertion: { name: "Insertion Sort", explanation: "Insertion sort builds the final sorted array one item at a time. It's much like how you would sort a hand of playing cards. It iterates through the input elements and inserts each element into its correct position in the sorted part of the array.", best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
        merge: { name: "Merge Sort", explanation: "A powerful 'Divide and Conquer' algorithm. It divides the array into two halves, calls itself for the two halves, and then merges the two sorted halves. This process is recursive and guarantees a fast performance, but requires extra memory for the merging process.", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
        quick: { name: "Quick Sort", explanation: "Also a 'Divide and Conquer' algorithm, often faster in practice than Merge Sort. It picks an element as a 'pivot', and partitions the array around the pivot, placing smaller elements to its left and larger ones to its right. This is done recursively on the sub-arrays.", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)" },
        heap: { name: "Heap Sort", explanation: "This is a comparison-based sorting technique based on a Binary Heap data structure. It first transforms the array into a max heap (where each parent node is larger than its children). It then repeatedly swaps the root (maximum element) with the last element and reduces the heap size by one, then heapifies the root.", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
        linear: { name: "Linear Search", explanation: "The most basic search algorithm. It sequentially checks each element of the list from the beginning until the target value is found. If it reaches the end of the list without finding the value, the search terminates unsuccessfully. It does not require the list to be sorted.", best: "O(1)", avg: "O(n)", worst: "O(n)" },
        binary: { name: "Binary Search", explanation: "A highly efficient search algorithm that works ONLY on sorted arrays. It repeatedly divides the search interval in half. If the target value is less than the middle element, it narrows the interval to the lower half; otherwise, to the upper half. This continues until the value is found or the interval is empty.", best: "O(1)", avg: "O(log n)", worst: "O(log n)" }
    };

    // --- EVENT LISTENERS ---
    generateBtn.addEventListener('click', resetAndGenerate);
    sortStartBtn.addEventListener('click', startSort);
    searchStartBtn.addEventListener('click', startSearch);
    stopBtn.addEventListener('click', () => { stopSignal = true; });
    speedSlider.addEventListener('input', (e) => { animationSpeed = 510 - e.target.value; });
    sortAlgoSelect.addEventListener('change', () => updateExplanation(sortAlgoSelect.value));
    searchAlgoSelect.addEventListener('change', () => updateExplanation(searchAlgoSelect.value));
    
    // --- CORE LOGIC ---
    function resetAndGenerate() {
        stopSignal = true;
        setTimeout(() => {
            stopSignal = false; isRunning = false;
            const userVal = arrayInput.value.trim();
            if (userVal === '') {
                // no user input — generate random array (preserve previous behavior)
                const randomArr = Array.from({ length: 25 }, () => Math.floor(Math.random() * 100) + 5);
                arrayInput.value = randomArr.join(',');
            } else {
                // user provided something — normalize it (trim spaces around commas)
                arrayInput.value = userVal.split(',').map(s => s.trim()).filter(s => s !== '').join(',');
            }
            generateBars();
            toggleControls(true);
        }, animationSpeed > 0 ? animationSpeed + 50 : 50);
    }
    
    async function startSort() {
        if (isRunning) return;
        isRunning = true; stopSignal = false; toggleControls(false);
        // ensure displayed bars reflect current input (user may have edited arrayInput)
        generateBars();
        clearHighlights();
        const bars = Array.from(document.getElementsByClassName('bar'));
        const algo = sortAlgoSelect.value;
        switch(algo) {
            case 'bubble': await bubbleSort(bars); break;
            case 'selection': await selectionSort(bars); break;
            case 'insertion': await insertionSort(bars); break;
            case 'merge': await mergeSort(bars, 0, bars.length - 1); break;
            case 'quick': await quickSort(bars, 0, bars.length - 1); break;
            case 'heap': await heapSort(bars); break;
        }
        if (!stopSignal) { markAllSorted(bars); }
        isRunning = false; toggleControls(true);
    }

    async function startSearch() {
        if (isRunning) return;
        // ensure displayed bars reflect current input (user may have edited arrayInput)
        generateBars();
        const bars = Array.from(document.getElementsByClassName('bar'));
        if (searchAlgoSelect.value === 'binary' && !isSorted(bars)) {
            alert('Binary Search requires a sorted array. Please sort it first!'); return;
        }
        isRunning = true; stopSignal = false; toggleControls(false);
        clearHighlights();
        if (searchAlgoSelect.value === 'linear') await linearSearch(bars);
        if (searchAlgoSelect.value === 'binary') await binarySearch(bars);
        isRunning = false; toggleControls(true);
    }
    
    // --- BAR & UI HELPERS ---
    function generateBars() {
        const arr = arrayInput.value.split(',').filter(n => n.trim() !== '').map(Number).filter(n => !isNaN(n));
        barContainer.innerHTML = '';
        arr.forEach(value => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${value * 3.5}px`;
            bar.dataset.value = value;
            bar.innerText = value;
            barContainer.appendChild(bar);
        });
    }

    function updateExplanation(selectedValue) {
        const data = algoData[selectedValue];
        algoTitle.innerText = data.name;
        algoExplanation.innerText = data.explanation;
        bestCase.innerText = data.best; avgCase.innerText = data.avg; worstCase.innerText = data.worst;
    }

    function toggleControls(enable) {
        generateBtn.disabled = !enable;
        sortStartBtn.disabled = !enable;
        searchStartBtn.disabled = !enable;
        arrayInput.disabled = !enable;
    }

    function clearHighlights() {
        document.querySelectorAll('.bar').forEach(b => b.classList.remove('comparing', 'swapping', 'pivot', 'sorted', 'found', 'pointer'));
    }

    async function markAllSorted(bars) {
        for (const bar of bars) { if (stopSignal) return; bar.classList.add('sorted'); await sleep(); }
    }

    function isSorted(bars) {
        for (let i = 0; i < bars.length - 1; i++) { if (parseInt(bars[i].dataset.value) > parseInt(bars[i + 1].dataset.value)) return false; }
        return true;
    }

    function sleep() { return new Promise(resolve => setTimeout(resolve, animationSpeed)); }
    
    function getValue(bar) { return parseInt(bar.dataset.value); }
    
    async function swapBars(bar1, bar2) {
        bar1.classList.add('swapping'); bar2.classList.add('swapping');
        await sleep();
        const tempHeight = bar1.style.height, tempValue = bar1.dataset.value, tempText = bar1.innerText;
        bar1.style.height = bar2.style.height; bar1.dataset.value = bar2.dataset.value; bar1.innerText = bar2.innerText;
        bar2.style.height = tempHeight; bar2.dataset.value = tempValue; bar2.innerText = tempText;
        await sleep();
        bar1.classList.remove('swapping'); bar2.classList.remove('swapping');
    }

    // --- ALGORITHM IMPLEMENTATIONS (FULL) ---

    async function bubbleSort(bars) {
        for (let i = 0; i < bars.length - 1; i++) {
            for (let j = 0; j < bars.length - i - 1; j++) {
                if (stopSignal) return;
                bars[j].classList.add('comparing'); bars[j + 1].classList.add('comparing');
                await sleep();
                if (getValue(bars[j]) > getValue(bars[j + 1])) { await swapBars(bars[j], bars[j + 1]); }
                bars[j].classList.remove('comparing'); bars[j + 1].classList.remove('comparing');
            }
            bars[bars.length - 1 - i].classList.add('sorted');
        }
        if (bars.length > 0) bars[0].classList.add('sorted');
    }

    async function selectionSort(bars) {
        for (let i = 0; i < bars.length - 1; i++) {
            let minIdx = i;
            bars[i].classList.add('pivot');
            for (let j = i + 1; j < bars.length; j++) {
                if (stopSignal) return;
                bars[j].classList.add('comparing');
                await sleep();
                if (getValue(bars[j]) < getValue(bars[minIdx])) { minIdx = j; }
                bars[j].classList.remove('comparing');
            }
            if (minIdx !== i) { await swapBars(bars[i], bars[minIdx]); }
            bars[i].classList.remove('pivot');
            bars[i].classList.add('sorted');
        }
        if (bars.length > 0) bars[bars.length - 1].classList.add('sorted');
    }

    async function insertionSort(bars) {
        for (let i = 1; i < bars.length; i++) {
            let keyBar = bars[i], j = i - 1;
            keyBar.classList.add('pivot');
            await sleep();
            while (j >= 0 && getValue(bars[j]) > getValue(keyBar)) {
                if (stopSignal) return;
                bars[j].classList.add('comparing');
                await swapBars(bars[j], bars[j+1]);
                bars[j].classList.remove('comparing');
                j--;
            }
            keyBar.classList.remove('pivot');
        }
    }

    async function mergeSort(bars, l, r) {
        if (l >= r) return;
        if (stopSignal) return;
        const m = l + Math.floor((r - l) / 2);
        await mergeSort(bars, l, m);
        await mergeSort(bars, m + 1, r);
        await merge(bars, l, m, r);
    }
    
    async function merge(bars, l, m, r) {
        const n1 = m - l + 1, n2 = r - m;
        let L = [], R = [];
        for (let i = 0; i < n1; i++) L.push({ val: getValue(bars[l+i]), height: bars[l+i].style.height, text: bars[l+i].innerText });
        for (let j = 0; j < n2; j++) R.push({ val: getValue(bars[m+1+j]), height: bars[m+1+j].style.height, text: bars[m+1+j].innerText });
        
        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (stopSignal) return;
            bars[k].classList.add('comparing');
            await sleep();
            if (L[i].val <= R[j].val) {
                bars[k].dataset.value = L[i].val; bars[k].style.height = L[i].height; bars[k].innerText = L[i].text; i++;
            } else {
                bars[k].dataset.value = R[j].val; bars[k].style.height = R[j].height; bars[k].innerText = R[j].text; j++;
            }
            bars[k].classList.remove('comparing'); k++;
        }
        while (i < n1) { if(stopSignal) return; bars[k].dataset.value = L[i].val; bars[k].style.height = L[i].height; bars[k].innerText = L[i].text; i++; k++; await sleep(); }
        while (j < n2) { if(stopSignal) return; bars[k].dataset.value = R[j].val; bars[k].style.height = R[j].height; bars[k].innerText = R[j].text; j++; k++; await sleep(); }
    }

    async function quickSort(bars, low, high) {
        if (low < high) {
            if (stopSignal) return;
            let pi = await partition(bars, low, high);
            await quickSort(bars, low, pi - 1);
            await quickSort(bars, pi + 1, high);
        }
    }
    
    async function partition(bars, low, high) {
        let pivotBar = bars[high];
        pivotBar.classList.add('pivot');
        let i = (low - 1);
        for (let j = low; j <= high - 1; j++) {
            if (stopSignal) return i;
            bars[j].classList.add('comparing');
            await sleep();
            if (getValue(bars[j]) < getValue(pivotBar)) {
                i++;
                await swapBars(bars[i], bars[j]);
            }
            bars[j].classList.remove('comparing');
        }
        await swapBars(bars[i + 1], bars[high]);
        pivotBar.classList.remove('pivot');
        return (i + 1);
    }
    
    async function heapSort(bars) {
        let n = bars.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            if(stopSignal) return; await heapify(bars, n, i);
        }
        for (let i = n - 1; i > 0; i--) {
            if(stopSignal) return;
            await swapBars(bars[0], bars[i]);
            bars[i].classList.add('sorted');
            await heapify(bars, i, 0);
        }
        if (n>0) bars[0].classList.add('sorted');
    }

    async function heapify(bars, n, i) {
        if(stopSignal) return;
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;
        bars[i].classList.add('pivot');
        if (l < n) bars[l].classList.add('comparing');
        if (r < n) bars[r].classList.add('comparing');
        await sleep();
        if (l < n && getValue(bars[l]) > getValue(bars[largest])) largest = l;
        if (r < n && getValue(bars[r]) > getValue(bars[largest])) largest = r;
        if (l < n) bars[l].classList.remove('comparing');
        if (r < n) bars[r].classList.remove('comparing');
        bars[i].classList.remove('pivot');
        if (largest != i) {
            await swapBars(bars[i], bars[largest]);
            await heapify(bars, n, largest);
        }
    }

    async function linearSearch(bars) {
        const target = parseInt(searchInput.value);
        if (isNaN(target)) { alert("Please enter a number to search."); return; }
        for (let i = 0; i < bars.length; i++) {
            if (stopSignal) return;
            bars[i].classList.add('comparing');
            await sleep();
            if (getValue(bars[i]) === target) {
                bars[i].classList.add('found'); return;
            }
            bars[i].classList.remove('comparing');
        }
        alert("Element not found.");
    }
    
    async function binarySearch(bars) {
        const target = parseInt(searchInput.value);
        if (isNaN(target)) { alert("Please enter a number to search."); return; }
        let low = 0, high = bars.length - 1;
        while (low <= high) {
            if (stopSignal) return;
            let mid = Math.floor(low + (high - low) / 2);
            bars[low].classList.add('pointer'); bars[high].classList.add('pointer');
            bars[mid].classList.add('comparing');
            await sleep();
            if (getValue(bars[mid]) === target) {
                bars[mid].classList.add('found'); return;
            }
            if (getValue(bars[mid]) < target) { low = mid + 1; }
            else { high = mid - 1; }
            bars[low-1]?.classList.remove('pointer'); bars[high+1]?.classList.remove('pointer');
            bars[mid].classList.remove('comparing');
        }
        alert("Element not found.");
    }

    // --- INITIALIZATION ---
    updateExplanation('bubble');
    resetAndGenerate();
});
