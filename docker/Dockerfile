FROM gitpod/workspace-full:latest

USER root

# Install Chromium
RUN apt-get update && apt-get install -y chromium-browser chromium-browser-l10n chromium-codecs-ffmpeg

# Give back control
USER root
