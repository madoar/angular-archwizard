FROM gitpod/workspace-full:latest

USER root

# Install Chromium
RUN apt-get update && apt-get install -y --no-install-recommends chromium-browser chromium-browser-l10n chromium-codecs-ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# Give back control
USER root
