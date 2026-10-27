export declare const openapi: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
    }[];
    components: {
        securitySchemes: {
            token: {
                type: string;
                in: string;
                name: string;
            };
        };
        schemas: {
            Customer: {
                type: string;
                required: string[];
                properties: {
                    name: {
                        type: string;
                    };
                    environment: {
                        type: string;
                    };
                    preparedBy: {
                        type: string;
                    };
                    criticalServices: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    nearRenewal: {
                        type: string;
                    };
                    teamCanVerify: {
                        type: string;
                    };
                    internalTerms: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
            };
            AssessRequest: {
                type: string;
                required: string[];
                properties: {
                    team: {
                        type: string;
                        description: string;
                    };
                    region: {
                        type: string;
                    };
                    demo: {
                        type: string;
                    };
                    customer: {
                        $ref: string;
                    };
                    pillars: {
                        type: string;
                        items: {
                            enum: string[];
                        };
                    };
                    deployment: {
                        enum: string[];
                    };
                    configText: {
                        type: string;
                    };
                    chartVersion: {
                        type: string;
                    };
                    otelVersion: {
                        type: string;
                    };
                    options: {
                        type: string;
                    };
                };
            };
            FindingPatch: {
                type: string;
                properties: {
                    verifyStatus: {
                        enum: string[];
                    };
                    progress: {
                        enum: string[];
                    };
                };
            };
            Report: {
                type: string;
                description: string;
            };
        };
    };
    security: {
        token: never[];
    }[];
    paths: {
        '/api/health': {
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/versions': {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/teams': {
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                responses: {
                    201: {
                        description: string;
                    };
                };
            };
        };
        '/api/config/detect': {
            post: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/runs': {
            post: {
                summary: string;
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    202: {
                        description: string;
                    };
                };
            };
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/runs/{id}': {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/runs/{id}/findings/{ruleId}': {
            patch: {
                summary: string;
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/runs/{id}/preview': {
            post: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/runs/{id}/outputs': {
            post: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/drafts': {
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/drafts/{id}': {
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            put: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            delete: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/runs/{id}/bundle': {
            post: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/runs/{id}/report': {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        enum: string[];
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
    };
};
