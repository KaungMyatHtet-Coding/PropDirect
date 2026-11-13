/**
 * Deterministic Contract Diff Engine
 * Fast Myers / LCS word and line diff computation in pure JavaScript.
 * Zero external paid dependencies.
 */

/**
 * Splits text into tokens (words with punctuation/spaces or lines).
 */
export function tokenize(text, mode = 'word') {
    if (!text) return [];
    if (mode === 'line') {
        return text.split('\n').map((line, idx, arr) => (idx < arr.length - 1 ? line + '\n' : line));
    }
    // Match words, whitespace, or punctuation
    return text.match(/[\w\u1000-\u109F]+|[^\w\s\u1000-\u109F]+|\s+/gu) || [];
}

/**
 * Compute Longest Common Subsequence (LCS) matrix
 */
function computeLCS(tokens1, tokens2) {
    const m = tokens1.length;
    const n = tokens2.length;
    const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (tokens1[i - 1] === tokens2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp;
}

/**
 * Computes token-level diff between oldText and newText.
 * Returns array of { type: 'unchanged' | 'added' | 'removed', value: string }
 */
export function computeTextDiff(oldText = '', newText = '', mode = 'word') {
    if (!oldText && !newText) return [];
    if (!oldText) return [{ type: 'added', value: newText }];
    if (!newText) return [{ type: 'removed', value: oldText }];
    if (oldText === newText) return [{ type: 'unchanged', value: oldText }];

    const tokens1 = tokenize(oldText, mode);
    const tokens2 = tokenize(newText, mode);

    const dp = computeLCS(tokens1, tokens2);
    const diff = [];

    let i = tokens1.length;
    let j = tokens2.length;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && tokens1[i - 1] === tokens2[j - 1]) {
            diff.unshift({ type: 'unchanged', value: tokens1[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            diff.unshift({ type: 'added', value: tokens2[j - 1] });
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
            diff.unshift({ type: 'removed', value: tokens1[i - 1] });
            i--;
        }
    }

    // Merge consecutive tokens of same type for cleaner rendering
    const merged = [];
    for (const item of diff) {
        if (merged.length > 0 && merged[merged.length - 1].type === item.type) {
            merged[merged.length - 1].value += item.value;
        } else {
            merged.push({ type: item.type, value: item.value });
        }
    }

    return merged;
}

/**
 * Calculates financial & key numeric terms comparison
 */
export function computeFinancialDiff(oldVer, newVer) {
    if (!oldVer || !newVer) return [];

    const oldRent = Number(oldVer.monthly_rent || 0);
    const newRent = Number(newVer.monthly_rent || 0);
    const rentDelta = newRent - oldRent;
    const rentPercent = oldRent > 0 ? ((rentDelta / oldRent) * 100).toFixed(1) : 0;

    const oldDeposit = Number(oldVer.deposit_amount || 0);
    const newDeposit = Number(newVer.deposit_amount || 0);
    const depositDelta = newDeposit - oldDeposit;
    const depositPercent = oldDeposit > 0 ? ((depositDelta / oldDeposit) * 100).toFixed(1) : 0;

    const oldDue = Number(oldVer.rent_due_day || 1);
    const newDue = Number(newVer.rent_due_day || 1);

    const oldAdvance = Number(oldVer.advance_payment_months || 1);
    const newAdvance = Number(newVer.advance_payment_months || 1);

    return [
        {
            key: 'monthly_rent',
            labelEn: 'Monthly Rent',
            labelMm: 'လစဉ်အိမ်လခ',
            oldVal: `${oldRent.toLocaleString()} Ks`,
            newVal: `${newRent.toLocaleString()} Ks`,
            delta: rentDelta,
            deltaFormatted: `${rentDelta > 0 ? '+' : ''}${rentDelta.toLocaleString()} Ks`,
            percent: rentPercent,
            direction: rentDelta > 0 ? 'increase' : rentDelta < 0 ? 'decrease' : 'same',
            isCurrency: true,
        },
        {
            key: 'deposit_amount',
            labelEn: 'Security Deposit',
            labelMm: 'စပေါ်ငွေ',
            oldVal: `${oldDeposit.toLocaleString()} Ks`,
            newVal: `${newDeposit.toLocaleString()} Ks`,
            delta: depositDelta,
            deltaFormatted: `${depositDelta > 0 ? '+' : ''}${depositDelta.toLocaleString()} Ks`,
            percent: depositPercent,
            direction: depositDelta > 0 ? 'increase' : depositDelta < 0 ? 'decrease' : 'same',
            isCurrency: true,
        },
        {
            key: 'rent_due_day',
            labelEn: 'Rent Due Day',
            labelMm: 'လခပေးရမည့်ရက်',
            oldVal: `${oldDue}th of month`,
            newVal: `${newDue}th of month`,
            delta: newDue - oldDue,
            deltaFormatted: `${newDue - oldDue > 0 ? '+' : ''}${newDue - oldDue} days`,
            direction: newDue !== oldDue ? 'changed' : 'same',
            isCurrency: false,
        },
        {
            key: 'advance_payment_months',
            labelEn: 'Advance Payment',
            labelMm: 'ကြိုတင်လခ',
            oldVal: `${oldAdvance} month(s)`,
            newVal: `${newAdvance} month(s)`,
            delta: newAdvance - oldAdvance,
            deltaFormatted: `${newAdvance - oldAdvance > 0 ? '+' : ''}${newAdvance - oldAdvance} mo`,
            direction: newAdvance !== oldAdvance ? 'changed' : 'same',
            isCurrency: false,
        },
        {
            key: 'lease_period',
            labelEn: 'Lease Period',
            labelMm: 'စာချုပ်သက်တမ်း',
            oldVal: `${oldVer.start_date || 'N/A'} ~ ${oldVer.end_date || 'N/A'}`,
            newVal: `${newVer.start_date || 'N/A'} ~ ${newVer.end_date || 'N/A'}`,
            delta: 0,
            deltaFormatted: oldVer.start_date !== newVer.start_date || oldVer.end_date !== newVer.end_date ? 'Updated' : 'Unchanged',
            direction: oldVer.start_date !== newVer.start_date || oldVer.end_date !== newVer.end_date ? 'changed' : 'same',
            isCurrency: false,
        },
    ];
}
