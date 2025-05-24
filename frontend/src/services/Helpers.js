export function getUserInitials(userName) {
    if (!userName) return '';
    const nameParts = userName.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0);
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
};