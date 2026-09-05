import propertyData from '@/data/properties.json';
import agentData from '@/data/agents.json';
import type { Agent, Property } from './types';

export const properties = propertyData as Property[];
export const agents = agentData as Agent[];

export function getPropertyById(id: number): Property | undefined {
    return properties.find((property) => property.id === id);
}

export function getAgentById(id: number): Agent | undefined {
    return agents.find((agent) => agent.id === id);
}

export function getAgentProperties(agentId: number): Property[] {
    return properties.filter((property) => property.agentId === agentId);
}

export function getSimilarProperties(property: Property, count = 3): Property[] {
    return properties
        .filter((candidate) => candidate.id !== property.id)
        .sort((a, b) => {
            const score = (candidate: Property) =>
                (candidate.type === property.type ? 2 : 0) +
                (candidate.location === property.location ? 1 : 0);
            return score(b) - score(a);
        })
        .slice(0, count);
}
