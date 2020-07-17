export function updateProfileFeatureStat(stat) {
  return {
    type: '@user/UPDATE_PROFILE_FEATURE_STAT',
    payload: stat,
  };
}
