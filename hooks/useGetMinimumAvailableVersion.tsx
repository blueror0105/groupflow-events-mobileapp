import { useState } from "react";
import { getMobileVersions } from "../lib/api/device";
import { EnvironmentConfig } from "../types/app-config";

export interface UseGetMinimalAvailableVersionInterface {
  handleGetMinimalAvailableVersion: (
    environmentConfig: EnvironmentConfig
  ) => Promise<MobileVersions>;
  loading: boolean;
}

export interface MobileVersions {
  minimumVersion: string;
  recalledVersions: string[];
  version: string;
}

export function useGetMinimalAvailableVersion(): UseGetMinimalAvailableVersionInterface {
  const [loading, setLoading] = useState<boolean>(true);

  const handleGetMinimalAvailableVersion = async (
    environmentConfig: EnvironmentConfig
  ): Promise<MobileVersions> => {
    try {
      return await getMobileVersions({ environmentConfig });
    } finally {
      setLoading(false);
    }
  };

  return { handleGetMinimalAvailableVersion, loading };
}
