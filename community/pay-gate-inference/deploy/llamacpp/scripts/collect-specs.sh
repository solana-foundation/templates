#!/usr/bin/env bash
# Run on the Ubuntu host before choosing llama.cpp model and runtime settings.
set -uo pipefail

section() { printf '\n===== %s =====\n' "$1"; }

section "OS"
sed -n '1,4p' /etc/os-release 2>/dev/null
uname -a
systemd-detect-virt 2>/dev/null || true

section "CPU"
lscpu

section "SIMD / matrix extensions"
grep -oE 'avx2|avx512[a-z0-9_]*|avx_vnni|amx_[a-z]*' /proc/cpuinfo | sort -u

section "Memory"
free -h
dmidecode -t memory 2>/dev/null |
  grep -E 'Speed|Type:|Size' |
  sort |
  uniq -c |
  sort -rn |
  head -10 || echo "(memory speed unavailable)"

section "NUMA topology"
numactl --hardware 2>/dev/null || lscpu | grep -i numa

section "Disks"
lsblk -d -o NAME,MODEL,SIZE,ROTA,TRAN
df -h / /opt 2>/dev/null

section "Network"
ip -br addr
